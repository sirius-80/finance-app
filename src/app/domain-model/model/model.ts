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

export class Entity {
    constructor(private entityId: string) { }
}

export class Category extends Entity {
    public children: Category[] = [];

    constructor(public id: string, public name: string, public parent: Category = null) {
        super(id);
    }

    getQualifiedName(): string {
        let qname: string;
        if (this.parent) {
            qname = this.parent.getQualifiedName() + '::';
        } else {
            qname = '';
        }
        return qname + this.name;
    }

    /**
     * Returns True if given other_category is an ancestor of this category. Returns False otherwise.
     */
    inheritsFrom(otherCategory: Category): boolean {
        if (this.parent) {
            if (this.parent.getQualifiedName() === otherCategory.getQualifiedName()) {
                return true;
            } else {
                return this.parent.inheritsFrom(otherCategory);
            }
        } else {
            return false;
        }
    }
}

export class Transaction extends Entity {
    constructor(public id: string,
        public account: Account,
        public serial: number,
        public date: Date,
        public amount: number,
        public name: string,
        public description: string,
        public counterAccount: string,
        public internal: boolean,
        public category: Category,
        public balanceAfter: number) {
        super(id);
    }

    /**
     * Create new empty transaction (all fields set to null or 0) on given date.
     * @param date 
     */
    static createEmpty(date: Date) {
        return new Transaction(null, null, 0, date, 0, null, null, null, false, null, 0);
    }

    /**
     * Updates the category on this transaction.
     * @param category category to assign to this transaction
     */
    updateCategory(category: Category): void {
        this.category = category;
    }

    /**
     * Marks this transaction as 'internal' if internal is True, or 'not internal' otherwise.
     */
    setInternal(internal: boolean): void {
        this.internal = internal;
    }
}

export class Account extends Entity {
    constructor(public id: string, public name: string, public bank: string, public transactions: Transaction[]) {
        super(id);
    }

    /**
     * Adds given transaction to this account. Note that the caller is responsible that transactions are only added once to an account.
     */
    addTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
    }

}
