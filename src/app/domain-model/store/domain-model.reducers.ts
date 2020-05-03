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
