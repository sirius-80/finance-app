import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Observable, combineLatest, generate, from, concat, zip, merge, of } from 'rxjs';
import { switchMap, first, filter, last, map, toArray, mergeAll, mergeMap, groupBy, reduce, tap, concatAll, withLatestFrom, zipAll, combineAll } from 'rxjs/operators';
import { Account, Transaction } from '../../domain-model/model/model';
import { Balance, Income } from '../model/model';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  balances$: Observable<Balance[]>;
  income$: Observable<Income[]>;
  dates$: Observable<Date[]>;
  combined$;

  constructor(private store: Store<AppState>) { }

  dateGenerator(startDate: Date, endDate: Date) {
    const temp = new Date(startDate.getTime());
    const start = new Date(temp.setMonth(temp.getMonth() + 1, 1)); // Extend 1 month, set to the first of the month
    const limit = new Date(endDate.setMonth(endDate.getMonth() + 1)); // Extend 1 month
    return generate(
      start,
      date => date <= limit,
      date => new Date(date.setMonth(date.getMonth() + 1))
    );
  }

  ngOnInit() {
    this.balances$ = this.store.select(state => state.domainModel.accounts).pipe(
      map(accounts => from(accounts).pipe(
        switchMap((account: Account) => from(account.transactions).pipe(
          first(),
          switchMap(t => this.dateGenerator(t.date, new Date())),
          switchMap(date => from(account.transactions).pipe(
            filter(t => t.date < date),
            last(),
            map(t => new Balance(date, t.balanceAfter))
          )),
        )),
        groupBy(balance => balance.date.getTime()),
        map(group => group.pipe(
          reduce((acc, val: Balance) => acc.add(val), new Balance(new Date(group.key), 0)),
        )),
        mergeAll(),
        toArray(),
      )),
      mergeAll(),
    );

    this.dates$ = this.store.select(state => state.domainModel.accounts).pipe(
      switchMap((accounts: Account[]) => from(accounts).pipe(
        switchMap(account => from(account.transactions).pipe(
          first(),
        )),
        groupBy((transaction: Transaction) => transaction.date.getTime()),
        map(group => new Date(group.key)),
        // tap(val => console.log('DATE', val)),
        map(date => this.dateGenerator(date, new Date())),
        mergeAll(),
        toArray(),
      )),
    );

    // this.income$ = this.dates$.pipe(
    //   withLatestFrom(this.store.select(state => state.domainModel.accounts)),
    //   switchMap(([dates, accounts]: [Date[], Account[]]) => zip(dates, accounts).pipe(
    //     switchMap(([date, account]: [Date, Account]) => from(account.transactions).pipe(
    //       filter(t => t.date >= date && t.date < new Date(date.getFullYear(), date.getMonth() + 1, 1)),
    //       filter(t => t.amount > 0),
    //       map(t => t.amount),
    //       reduce((acc, val) => acc + val, 0),
    //       map(amount => new Income(date, amount)),
    //     )),
    //     groupBy(income => income.date.getTime()),
    //     switchMap(group => group.pipe(
    //       reduce((acc, val) => acc.add(val), new Income(new Date(group.key), 0))
    //     )),
    //     toArray(),
    //     )),
    // );

    // this.income$.subscribe(val => console.log('Income:', val));

    this.income$ = combineLatest(this.dates$, this.store.select(state => state.domainModel.accounts),
      (dates, accounts) => {
        const income: Income[] = [];
        from(dates).pipe(
          switchMap((date: Date) => from(accounts).pipe(
            switchMap((account: Account) => from(account.transactions).pipe(
              filter(t => t.date >= date && t.date < new Date(date.getFullYear(), date.getMonth() + 1, 1)),
              filter(t => t.amount > 0),
              map(t => t.amount),
              reduce((acc, val) => acc + val, 0),
            )),
            map(amount => new Income(date, amount)),
          )),
          groupBy(income => income.date.getTime()),
          map(group => group.pipe(
            reduce((acc, val) => acc.add(val), new Income(new Date(group.key), 0))
          )),
          mergeAll(),
          // tap(val => console.log(val)),
        ).subscribe(val => income.push(val));
        return income;
      }
    );

    this.combined$ = this.dates$.pipe(
      withLatestFrom(this.balances$, this.income$),
      mergeMap(([dates, balances, incomes]) => zip(from(dates), from(balances), from(incomes)).pipe(
        toArray(),
      )),
    );

  }
}
