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
