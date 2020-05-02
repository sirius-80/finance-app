import { Action } from '@ngrx/store';
import { Balance } from 'src/app/account-view/model/model';
import { Account } from '../model/model';

export const LOAD_ACCOUNTS = '[Domain-model] LOAD_ACCOUNTS';
export const SET_ACCOUNTS = '[Domain-model] SET_ACCOUNTS';

export class LoadAccounts implements Action {
    readonly type = LOAD_ACCOUNTS;
}

export class SetAccounts implements Action {
    readonly type = SET_ACCOUNTS;
    constructor(public payload: Account[]) {}
}


export type domainModelActions = LoadAccounts | SetAccounts;
