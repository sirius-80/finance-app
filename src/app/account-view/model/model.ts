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
}

export class Profit {
    constructor(public date: Date, public profit: number) {}
}

export class Loss {
    constructor(public date: Date, public loss: number) {}
}
