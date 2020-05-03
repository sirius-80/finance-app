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

export class Balance {
    constructor(public date: Date, public balance: number) {}

    add(other: Balance) {
        return new Balance(this.date, this.balance + other.balance);
    }
}

export class Income {
    constructor(public date: Date, public income: number) {}

    add(other: Income) {
        return new Income(this.date, this.income + other.income);
    }
}

export class Expenses {
    constructor(public date: Date, public expenses: number) {}

    add(other: Expenses) {
        return new Expenses(this.date, this.expenses + other.expenses);
    }
}

export class Profit {
    constructor(public date: Date, public profit: number) {}
}

export class Loss {
    constructor(public date: Date, public loss: number) {}
}
