import { CategoryBudget } from "../types";
import { TransactionCategory } from "./transactions";

export const dummyCategoriesData: CategoryBudget[] = [
    {
        id: 1,
        categoryName: TransactionCategory.FOOD_DRINKS,
        spent: 450,
        allocated: 600,
    },
    {
        id: 2,
        categoryName: TransactionCategory.TRANSPORT,
        spent: 300,
        allocated: 350,
    },
    {
        id: 3,
        categoryName: TransactionCategory.RENT,
        spent: 1200,
        allocated: 1200,
    },
    {
        id: 4,
        categoryName: TransactionCategory.SHOPPING,
        spent: 50,
        allocated: 200,
    },
    {
        id: 5,
        categoryName: TransactionCategory.TRAVEL,
        spent: 700,
        allocated: 500, // Over budget example
    },
];