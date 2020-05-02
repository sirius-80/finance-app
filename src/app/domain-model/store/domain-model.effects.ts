import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, filter, withLatestFrom, mergeMap, toArray, mergeAll, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { State } from './domain-model.reducers';
import * as domainModelActions from './domain-model.actions';
import { AccountPojo } from '../model/server-types';
import { Account, Transaction, Category } from '../model/model';
import { from } from 'rxjs';


@Injectable()
export class DomainModelEffects {
    private SERVER = 'localhost';


    constructor(private actions$: Actions,
        private httpClient: HttpClient,
        private store: Store<State>) { }

    @Effect()
    doLoadAccounts = this.actions$.pipe(
        ofType(domainModelActions.LOAD_ACCOUNTS),
        switchMap((action: domainModelActions.LoadAccounts) => {
            const url = 'http://' + this.SERVER + ':5002/accounts';
            console.log('Retrieving accounts from server');
            return this.httpClient.get<AccountPojo[]>(url);
        }),
        map((accountPojos: AccountPojo[]) => from(accountPojos).pipe(
            withLatestFrom(this.store.select(state => state.categories)),
            map(([accountPojo, categories]: [AccountPojo, Category[]]) => {
                const account = new Account(accountPojo.id, accountPojo.name, accountPojo.bank, []);
                let category: Category = null;
                for (const t of accountPojo.transactions) {
                    if (t.categoryId) {
                        for (const cat of categories) {
                            if (t.categoryId === cat.id) {
                                category = cat;
                            }
                        }
                    }
                    account.addTransaction(new Transaction(t.id, account, t.serial, new Date(t.date), t.amount, t.name, t.description, t.counterAccount, t.internal, category, t.balanceAfter));
                }
                return account;
            }),
            toArray(),
        )),
        tap(val => console.log('TAP:', val)),
        mergeAll(),
        map((accounts: Account[]) => {
            console.log('Setting accounts', accounts);
            
            return new domainModelActions.SetAccounts(accounts);
        })
    );

}