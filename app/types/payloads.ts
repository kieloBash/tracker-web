import { PaymentMethod, TransactionCategory } from "../constants/transactions";

export type TransactionType = 'Expense' | 'Income';

export interface AddCalculationsPayload {
    type: TransactionType;
    amount: number;
    date: string;
    description?: string;
    categories: TransactionCategory[];
    paymentMethod: PaymentMethod;
}

