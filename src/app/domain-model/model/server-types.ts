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

export interface CategoryPojo  {
    id: string,
    name: string,
    parent: CategoryPojo,
    children: CategoryPojo[],
}

export interface TransactionPojo {
    id: string,
    account: string,
    serial: number,
    date: string,
    amount: number,
    name: string,
    description: string,
    counterAccount: string,
    internal: boolean,
    categoryId: string,
    balanceAfter: number,
}

export interface AccountPojo {
    id: string,
    name: string,
    bank: string,
    transactions: TransactionPojo[],
}
