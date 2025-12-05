import * as z from "zod";
import { PaymentMethod, TransactionCategory, TransactionCategoryList } from "../constants/transactions";
import { TransactionType } from "./payloads";

export interface TransactionItem {
    description: string;
    amount: number;
    categories: TransactionCategory[];
    type: TransactionType;
    id: string;
    paymentMethod: PaymentMethod;
    date: Date;
}

// 2. Define the structure for transactions within a single day
// Keys are the day of the month (string "1", "2", etc.)
export interface DailyTransactions {
    [dayOfMonth: string]: TransactionItem[];
}

// 3. Define the main structure for the entire data object
// Keys are the month names (string "January", "February", etc.)
export interface MonthlyTransactionLog {
    [monthName: string]: DailyTransactions;
}

export interface CategoryBudget {
    id: number;
    categoryName: TransactionCategory;
    spent: number;
    allocated: number;
}

export const NewCategoryBudgetSchema = z.object({
    categoryName: z.enum(TransactionCategoryList as [string, ...string[]]),

    // allocated remains the same
    allocated: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number().min(0, {
            message: "Allocation must be a non-negative number.",
        })
    ),
});

export type NewCategoryBudgetFormValues = z.infer<typeof NewCategoryBudgetSchema>;