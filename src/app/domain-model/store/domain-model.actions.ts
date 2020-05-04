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

import { Action } from '@ngrx/store';
import { BankAccount, Category } from '../model/model';

export const LOAD_ACCOUNTS = '[Domain-model] LOAD_ACCOUNTS';
export const SANITY_CHECK_ACCOUNTS = '[Domain-model] SANITY_CHECK_ACCOUNTS';
export const SET_ACCOUNTS = '[Domain-model] SET_ACCOUNTS';

export const LOAD_CATEGORIES = '[Domain-model] LOAD_CATEGORIES';
export const SET_CATEGORIES = '[Domain-model] SET_CATEGORIES';

export class LoadAccounts implements Action {
    readonly type = LOAD_ACCOUNTS;
}

export class SanityCheckAccounts implements Action {
    readonly type = SANITY_CHECK_ACCOUNTS;
    constructor(public payload: BankAccount[]) {}
}

export class SetAccounts implements Action {
    readonly type = SET_ACCOUNTS;
    constructor(public payload: BankAccount[]) {}
}

export class LoadCategories implements Action {
    readonly type = LOAD_CATEGORIES;
}

export class SetCategories implements Action {
    readonly type = SET_CATEGORIES;
    constructor(public payload: Category[]) {}
}


export type domainModelActions = LoadAccounts | SanityCheckAccounts | SetAccounts
    | LoadCategories | SetCategories;
