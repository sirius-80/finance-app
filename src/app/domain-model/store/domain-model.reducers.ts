import { Category, Account } from '../model/model';
import * as domainModelActions from './domain-model.actions';


export interface State {
    accounts: Account[],
    categories: Category[]
}

const initialState: State = {
    accounts: [],
    categories: []
}

export function domainModelReducer(state = initialState, action: domainModelActions.domainModelActions) {
    switch(action.type) {
        case domainModelActions.SET_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload
            }
        default:
            return state;
    }
}
