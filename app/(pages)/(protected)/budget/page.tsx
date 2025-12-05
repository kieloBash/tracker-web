"use client"

import BudgetAnalyticsCard from "@/app/components/budget-analytics-card"
import CategoriesSpentCard from "@/app/components/categories-spent-card"
import IncomeSavingsCard from "@/app/components/income-savings-card"
import { dummyAllTransactions } from "@/app/constants/dummy-logs"
import { TransactionCategory } from "@/app/constants/transactions"
import { CategoryBudget, TransactionItem } from "@/app/types"
import { getMonthYearKey } from "@/app/utils"
import { getDaysInMonth, isSameDay, startOfMonth } from "date-fns"
import { useState } from "react"

/**
* Computes the total income and expense for each month present in the transactions.
* @param transactions The flat array of all TransactionItem objects.
* @returns An object mapping "Month Year" string to an object containing total income and expense.
*/
const computeMonthlyTotals = (transactions: TransactionItem[]) => {
    const monthlyTotals: Record<string, { income: number, expense: number }> = {};

    transactions.forEach(transaction => {
        const key = getMonthYearKey(transaction.date);

        // Initialize month key if it doesn't exist
        if (!monthlyTotals[key]) {
            monthlyTotals[key] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'Income') {
            monthlyTotals[key].income += transaction.amount;
        } else if (transaction.type === 'Expense') {
            monthlyTotals[key].expense += transaction.amount;
        }
    });

    // Round the totals to two decimal places for financial accuracy
    for (const key in monthlyTotals) {
        if (monthlyTotals.hasOwnProperty(key)) {
            monthlyTotals[key].income = parseFloat(monthlyTotals[key].income.toFixed(2));
            monthlyTotals[key].expense = parseFloat(monthlyTotals[key].expense.toFixed(2));
        }
    }

    return monthlyTotals;
};

/**
 * Computes the total amount spent on a specific day (defaulting to today's real date).
 * @param transactions The flat array of all TransactionItem objects.
 * @param targetDate The date to check spending for (defaults to new Date()).
 * @returns The total amount spent on the target date.
 */
const computeSpentToday = (
    transactions: TransactionItem[],
    targetDate: Date = new Date()
): number => {

    const totalSpent = transactions.reduce((sum, transaction) => {
        // 🚀 Use isSameDay from date-fns for reliable comparison
        if (transaction.type === 'Expense' && isSameDay(transaction.date, targetDate)) {
            return sum + transaction.amount;
        }
        return sum;
    }, 0);

    // Return the total rounded to two decimal places
    return parseFloat(totalSpent.toFixed(2));
};

/**
 * Computes the total expense amount for the current month and year.
 * * @param transactions The flat array of all TransactionItem objects.
 * @returns The total amount spent in the current month (defaults to new Date()).
 */
const computeCurrentMonthTotalSpent = (transactions: TransactionItem[]): number => {
    const today = new Date();
    // 1. Determine the key for the current month (e.g., "December 2025")
    const currentMonthKey = getMonthYearKey(today);

    const totalSpent = transactions.reduce((sum, transaction) => {
        const transactionMonthKey = getMonthYearKey(transaction.date);

        // 2. Check if the transaction is an expense AND belongs to the current month
        if (transaction.type === 'Expense' && transactionMonthKey === currentMonthKey) {
            return sum + transaction.amount;
        }
        return sum;
    }, 0);

    // 3. Return the total rounded to two decimal places
    return parseFloat(totalSpent.toFixed(2));
};

interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

/**
 * Converts a list of transactions into an aggregated list of CategoryBudget objects.
 * This function calculates the total 'spent' amount (only for 'Expense' types) 
 * for each category, optionally filtering the transactions by a date range.
 *
 * @param transactions The flat array of all TransactionItem objects.
 * @param range Optional object containing startDate and/or endDate for filtering.
 * @returns An array of CategoryBudget objects.
 */
export const transactionsToCategoryBudgets = (
    transactions: TransactionItem[],
    range?: DateRange
): CategoryBudget[] => {
    // 1. Filter transactions based on the provided date range
    let filteredTransactions = transactions;
    if (range?.startDate || range?.endDate) {
        filteredTransactions = transactions.filter(t => {
            const dateTimestamp = t.date.getTime();

            // Set start to -Infinity if not provided
            const startTimestamp = range.startDate ? range.startDate.getTime() : -Infinity;

            // Set end to Infinity if not provided (to include all future dates if start is set)
            // We set the end date to the end of the day for inclusivity, if possible.
            const endDate = range.endDate || new Date(Infinity);
            const endTimestamp = endDate.getTime();

            return dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp;
        });
    }

    // 2. Aggregate expenses by category using a Map
    // We only track expenses here, as 'spent' relates to outflow.
    const categoryMap: Record<TransactionCategory, number> = {};

    filteredTransactions.forEach(t => {
        if (t.type === 'Expense') {
            t.categories.forEach(category => {
                // Sum the amount for each category found in the transaction
                categoryMap[category] = (categoryMap[category] || 0) + t.amount;
            });
        }
    });

    // 3. Convert the aggregation map into the target CategoryBudget array structure
    const categoryBudgets: CategoryBudget[] = [];
    let idCounter = 1; // Simple sequential ID for the demo

    for (const categoryName in categoryMap) {
        const spent = categoryMap[categoryName];

        categoryBudgets.push({
            id: idCounter++,
            categoryName: categoryName as TransactionCategory,
            spent: parseFloat(spent.toFixed(2)), // Ensure amount is rounded
            allocated: 0, // Placeholder value: you would merge this with real allocation data later
        });
    }

    return categoryBudgets;
};

const BudgetPage = () => {
    // TODO: fetch from backend
    const transactions = dummyAllTransactions;

    // 1. Compute Monthly Income and Expenses
    const currentMonthSpent = computeCurrentMonthTotalSpent(transactions);

    // 3. Compute Spent Today (using the real current date: Dec 4, 2025)
    const spentTodayReal = computeSpentToday(transactions);

    const [monthlyIncome, setMonthlyIncome] = useState(35000)
    const [savingsGoal, setSavingsGoal] = useState(8000)

    const budgetLimit = monthlyIncome - savingsGoal;

    const today = new Date();
    const daysInMonth = getDaysInMonth(today);

    const categoriesData = transactionsToCategoryBudgets(transactions, { startDate: startOfMonth(new Date()), endDate: new Date() })


    const handleUpdateIncomeSavings = (monthlyIncome: number, savingsGoal: number) => {
        setMonthlyIncome(monthlyIncome);
        setSavingsGoal(savingsGoal);

        // TODO: update backend
    }

    return (
        <div className="flex flex-col justify-start items-center px-6 py-6 gap-6">
            <IncomeSavingsCard
                savingsGoal={savingsGoal}
                monthlyIncome={monthlyIncome}
                handleUpdateIncomeSavings={handleUpdateIncomeSavings}
            />
            <BudgetAnalyticsCard
                budgetLimit={budgetLimit}
                spentAmount={currentMonthSpent}
                currentDay={today.getDate()}
                daysInMonth={daysInMonth}
                todaySpentAmount={spentTodayReal}
            />
            <CategoriesSpentCard
                data={categoriesData}
            />
        </div>
    )
}

export default BudgetPage