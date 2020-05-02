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
