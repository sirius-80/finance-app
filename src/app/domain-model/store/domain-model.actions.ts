import { Action } from '@ngrx/store';
import { Account } from '../model/model';

export const LOAD_ACCOUNTS = '[Domain-model] LOAD_ACCOUNTS';
export const SANITY_CHECK_ACCOUNTS = '[Domain-model] SANITY_CHECK_ACCOUNTS';
export const SET_ACCOUNTS = '[Domain-model] SET_ACCOUNTS';

export class LoadAccounts implements Action {
    readonly type = LOAD_ACCOUNTS;
}

export class SanityCheckAccounts implements Action {
    readonly type = SANITY_CHECK_ACCOUNTS;
    constructor(public payload: Account[]) {}
}

export class SetAccounts implements Action {
    readonly type = SET_ACCOUNTS;
    constructor(public payload: Account[]) {}
}


export type domainModelActions = LoadAccounts | SanityCheckAccounts | SetAccounts;
