/* 
 *  Copyright 2020 Erik Schepers
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Observable, generate, from, zip } from 'rxjs';
import { switchMap, first, filter, last, map, toArray, mergeAll, mergeMap, groupBy, reduce, tap, withLatestFrom, defaultIfEmpty } from 'rxjs/operators';
import { Account, Transaction } from '../../domain-model/model/model';
import { Balance, Income, Expenses, Profit, Loss } from '../model/model';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  dates$: Observable<Date[]>;
  balances$: Observable<Balance[]>;
  income$: Observable<Income[]>;
  expenses$: Observable<Expenses[]>;
  profit$: Observable<Profit[]>;
  loss$: Observable<Loss[]>;
  combined$: Observable<[Date, Balance, Income, Expenses, Profit, Loss][]>;

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
    this.dates$ = this.store.select(state => state.domainModel.accounts).pipe(
      switchMap((accounts: Account[]) => from(accounts).pipe(
        switchMap(account => from(account.transactions).pipe(
          first(),
        )),
        groupBy((transaction: Transaction) => transaction.date.getTime()),
        map(group => new Date(group.key)),
        map(date => this.dateGenerator(date, new Date())),
        mergeAll(),
        toArray(),
      )),
      tap(val => console.log('Derived dates'))
    );

    this.balances$ = this.store.select(state => state.domainModel.accounts).pipe(
      withLatestFrom(this.dates$),
      switchMap(([accounts, dates]) => from(dates).pipe(
        switchMap(date => from(accounts).pipe(
          switchMap(account => from(account.transactions).pipe(
            filter(t => t.date < date),
            map(t => t.balanceAfter),
            defaultIfEmpty(0),
            last(),
            map(balance => new Balance(date, balance))
          )),
          groupBy(balance => balance.date.getTime()),
          switchMap(group => group.pipe(
            reduce((acc, val) => acc.add(val), new Balance(new Date(group.key), 0))
          )),
        )),
        toArray(),
      )),
      tap(val => console.log('Derived balances'))
    );

    this.income$ = this.store.select(state => state.domainModel.accounts).pipe(
      withLatestFrom(this.dates$),
      switchMap(([accounts, dates]) => from(dates).pipe(
        switchMap(date => from(accounts).pipe(
          switchMap(account => from(account.transactions).pipe(
            filter(t => !t.internal),
            filter(t => t.date >= date && t.date < new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())),
            filter(t => t.amount > 0),
            map(t => t.amount),
            reduce((acc, val) => acc + val, 0),
            map(amount => new Income(date, amount)),
          )),
          groupBy(income => income.date.getTime()),
          switchMap(group => group.pipe(
            reduce((acc, val) => acc.add(val), new Income(new Date(group.key), 0))
          )),
        )),
        toArray(),
      )),
      tap(val => console.log('Derived income'))
    );

    this.expenses$ = this.store.select(state => state.domainModel.accounts).pipe(
      withLatestFrom(this.dates$),
      switchMap(([accounts, dates]) => from(dates).pipe(
        switchMap(date => from(accounts).pipe(
          switchMap(account => from(account.transactions).pipe(
            filter(t => !t.internal),
            filter(t => t.date >= date && t.date < new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())),
            filter(t => t.amount < 0),
            map(t => t.amount),
            reduce((acc, val) => acc + val, 0),
            map(amount => new Expenses(date, amount)),
          )),
          groupBy(income => income.date.getTime()),
          switchMap(group => group.pipe(
            reduce((acc, val) => acc.add(val), new Expenses(new Date(group.key), 0))
          )),
        )),
        toArray(),
      )),
      tap(val => console.log('Derived expenses'))
    );

    this.profit$ = this.dates$.pipe(
      withLatestFrom(this.income$, this.expenses$),
      mergeMap(([dates, incomes, expenses]) => zip(from(dates), from(incomes), from(expenses)).pipe(
        map(([date, income, expenses]) => {
          const profitOrLoss = income.income + expenses.expenses;
          if (profitOrLoss > 0) {
            return new Profit(date, income.income + expenses.expenses);
          } else {
            return new Profit(date, 0);
          }
        }),
        toArray(),
      )),
      tap(val => console.log('Derived profits'))
    );

    this.loss$ = this.dates$.pipe(
      withLatestFrom(this.income$, this.expenses$),
      mergeMap(([dates, incomes, expenses]) => zip(from(dates), from(incomes), from(expenses)).pipe(
        map(([date, income, expenses]) => {
          const profitOrLoss = income.income + expenses.expenses;
          if (profitOrLoss < 0) {
            return new Loss(date, income.income + expenses.expenses);
          } else {
            return new Loss(date, 0);
          }
        }),
        toArray(),
      )),
      tap(val => console.log('Derived losses'))
    );

    this.combined$ = this.dates$.pipe(
      withLatestFrom(this.balances$, this.income$, this.expenses$, this.profit$, this.loss$),
      mergeMap(([dates, balances, incomes, expenses, profif, loss]) =>
        zip(from(dates), from(balances), from(incomes), from(expenses), from(profif), from(loss)).pipe(
          toArray(),
        )),
      tap(val => console.log('Derived combinations'))
    );

  }
}
