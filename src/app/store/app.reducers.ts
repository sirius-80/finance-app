import { ActionReducerMap } from '@ngrx/store';

import * as domainModel from '../domain-model/store/domain-model.reducers';
// import * as accountsView from '../account-view/store/account-view.reducers';

export interface AppState {
    domainModel: domainModel.State;
    // accountsView: accountsView.State;
}

export const reducers: ActionReducerMap<AppState> = {
    domainModel: domainModel.domainModelReducer
//   domainModel: domainModel.domainModelReducer,
//   accountsView: accountsView.ac
}
