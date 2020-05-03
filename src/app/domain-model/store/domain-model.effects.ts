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

import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom, toArray, mergeAll, tap } from 'rxjs/operators';

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
        switchMap((accounts: Account[]) => {
            console.log('Setting accounts', accounts);
            return [
                new domainModelActions.SanityCheckAccounts(accounts),
                new domainModelActions.SetAccounts(accounts),
            ];
        })
    );

    @Effect({dispatch: false})
    doSanityCheckAccounts = this.actions$.pipe(
        ofType(domainModelActions.SANITY_CHECK_ACCOUNTS),
        switchMap((action: domainModelActions.SanityCheckAccounts) => from(action.payload).pipe(
            map(account => {
                const EPSILON = 1e-8;
                const invalidTransactions: Transaction[] = [];
                let balance = undefined;
                for (const t of account.transactions) {
                    if (balance !== undefined) {
                        if (balance + t.amount - t.balanceAfter > EPSILON) {
                            invalidTransactions.push(t);
                            console.log('ERROR: Invalid transaction:', t);
                        } else {
                            // console.log('Transaction OK', t);
                        }
                    }
                    balance = t.balanceAfter;
                }
                return invalidTransactions;
            }),
        ))
    );
}