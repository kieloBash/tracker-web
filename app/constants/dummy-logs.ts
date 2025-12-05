import { MonthlyTransactionLog, TransactionItem } from "../types";
import { PaymentMethod, TransactionCategory } from "./transactions";

const YEAR = 2025;

// --- Helper functions (kept for context) ---
const createExpense = (
    id: string,
    description: string,
    amount: number,
    categories: TransactionCategory[],
    paymentMethod: PaymentMethod,
    monthName: string,
    day: string
): TransactionItem => {
    const monthIndex = new Date(Date.parse(monthName + " 1, " + YEAR)).getMonth();
    return {
        id: id,
        description: description,
        amount: amount,
        categories: categories,
        type: 'Expense',
        paymentMethod: paymentMethod,
        date: new Date(YEAR, monthIndex, parseInt(day)),
    };
};

const createIncome = (
    id: string,
    description: string,
    amount: number,
    categories: TransactionCategory[],
    paymentMethod: PaymentMethod,
    monthName: string,
    day: string
): TransactionItem => {
    const monthIndex = new Date(Date.parse(monthName + " 1, " + YEAR)).getMonth();
    return {
        id: id,
        description: description,
        amount: amount,
        categories: categories,
        type: 'Income',
        paymentMethod: paymentMethod,
        date: new Date(YEAR, monthIndex, parseInt(day)),
    };
};
// -------------------------------------------------------------------


const dummyTransactionLog: MonthlyTransactionLog = {
    "January": {
        "1": [
            createExpense("t123", "Weekly Groceries", 125.75, [TransactionCategory.SHOPPING, TransactionCategory.FOOD_DRINKS], PaymentMethod.MASTERCARD, "January", "1"),
            createIncome("t124", "Salary Deposit", 3500.00, [TransactionCategory.SALARY], PaymentMethod.BANK_TRANSFER, "January", "1"),
            createExpense("t137", "Gas for Car", 45.00, [TransactionCategory.TRANSPORT], PaymentMethod.VISA, "January", "1"),
        ],
        "2": [
            createExpense("t125", "Rent Payment", 1500.00, [TransactionCategory.RENT], PaymentMethod.BANK_TRANSFER, "January", "2"),
            createExpense("t138", "Online Subscription", 9.99, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.PAYMAYA, "January", "2"),
        ],
        "3": [
            createExpense("t126", "Ride Share to work", 15.50, [TransactionCategory.TRANSPORT], PaymentMethod.GCASH, "January", "3"),
            createExpense("t139", "Lunch with client", 35.00, [TransactionCategory.FOOD_DRINKS], PaymentMethod.VISA, "January", "3"),
        ],
        "4": [
            createExpense("t129", "Health Insurance Premium", 150.00, [TransactionCategory.HEALTH, TransactionCategory.BILLS_UTILITIES], PaymentMethod.BANK_TRANSFER, "January", "4"),
            createExpense("t140", "New gym shoes", 89.99, [TransactionCategory.SHOPPING], PaymentMethod.MASTERCARD, "January", "4"),
        ],
        "10": [
            createExpense("t130", "Monthly Investment Deposit", 500.00, [TransactionCategory.INVESTMENTS], PaymentMethod.BANK_TRANSFER, "January", "10"),
        ],
        "15": [
            createIncome("t127", "Freelance Project Pay", 800.00, [TransactionCategory.FREELANCE], PaymentMethod.BANK_TRANSFER, "January", "15"),
            createExpense("t141", "Internet/Cable Bill", 79.99, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.MARI_BANK, "January", "15"),
        ],
        "20": [
            createExpense("t131", "Weekend Trip Hotel Booking", 280.00, [TransactionCategory.TRAVEL], PaymentMethod.VISA, "January", "20"),
            createExpense("t142", "Toll Charges", 8.50, [TransactionCategory.TRANSPORT], PaymentMethod.CASH, "January", "20"),
        ],
        "25": [
            createIncome("t132", "Birthday Gift from Dad", 100.00, [TransactionCategory.GIFT], PaymentMethod.CASH, "January", "25"),
        ]
    },
    "February": {
        "1": [
            createExpense("t133", "Internet Bill", 65.00, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.BANK_TRANSFER, "February", "1"),
            createExpense("t143", "Emergency Plumbing Repair", 250.00, [TransactionCategory.UNCATEGORIZED], PaymentMethod.CASH, "February", "1"),
        ],
        "5": [
            createExpense("t128", "Coffee and Pastry", 8.00, [TransactionCategory.FOOD_DRINKS], PaymentMethod.GCASH, "February", "5"),
        ],
        "14": [
            createExpense("t134", "Valentine's Dinner", 95.00, [TransactionCategory.FOOD_DRINKS, TransactionCategory.SHOPPING], PaymentMethod.VISA, "February", "14"),
            createIncome("t144", "Stock Dividends", 45.50, [TransactionCategory.INVESTMENTS], PaymentMethod.BANK_TRANSFER, "February", "14"),
        ],
        "28": [
            createExpense("t135", "Public Transport Pass Refill", 120.00, [TransactionCategory.TRANSPORT], PaymentMethod.MASTERCARD, "February", "28"),
            createExpense("t145", "Haircut", 40.00, [TransactionCategory.SHOPPING], PaymentMethod.CASH, "February", "28"),
        ]
    },
    "March": {
        "1": [
            createIncome("t136", "Quarterly Investment Return", 250.00, [TransactionCategory.INVESTMENTS], PaymentMethod.BANK_TRANSFER, "March", "1"),
            createExpense("t146", "Home cleaning supplies", 22.00, [TransactionCategory.SHOPPING], PaymentMethod.VISA, "March", "1"),
        ],
        "15": [
            createIncome("t147", "Salary Deposit", 3500.00, [TransactionCategory.SALARY], PaymentMethod.BANK_TRANSFER, "March", "15"),
            createExpense("t148", "Online News Subscription", 12.00, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.PAYMAYA, "March", "15"),
        ],
        "22": [
            createExpense("t149", "Doctor Visit Copay", 30.00, [TransactionCategory.HEALTH], PaymentMethod.CASH, "March", "22"),
        ]
    },
    "April": {
        "5": [
            createExpense("t150", "Spring Clothes Shopping", 180.00, [TransactionCategory.SHOPPING], PaymentMethod.MASTERCARD, "April", "5"),
        ],
        "10": [
            createExpense("t151", "Rent Payment", 1500.00, [TransactionCategory.RENT], PaymentMethod.BANK_TRANSFER, "April", "10"),
            createExpense("t152", "Electric Bill", 98.00, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.ATOME, "April", "10"),
        ],
        "25": [
            createIncome("t153", "Commission Payout", 600.00, [TransactionCategory.FREELANCE], PaymentMethod.BANK_TRANSFER, "April", "25"),
            createExpense("t154", "Weekend Getaway Flight", 450.00, [TransactionCategory.TRAVEL], PaymentMethod.VISA, "April", "25"),
        ]
    },
    "May": {
        "1": [
            createExpense("t155", "Gym Membership Fee", 49.99, [TransactionCategory.HEALTH], PaymentMethod.VISA, "May", "1"),
        ],
        "15": [
            createIncome("t156", "Salary Deposit", 3500.00, [TransactionCategory.SALARY], PaymentMethod.BANK_TRANSFER, "May", "15"),
            createExpense("t157", "Car Maintenance", 120.00, [TransactionCategory.TRANSPORT], PaymentMethod.MASTERCARD, "May", "15"),
        ],
        "20": [
            createExpense("t158", "Dining out with friends", 75.00, [TransactionCategory.FOOD_DRINKS], PaymentMethod.CASH, "May", "20"),
        ]
    },
    "June": {
        "5": [
            createExpense("t159", "Water Bill", 35.00, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.BANK_TRANSFER, "June", "5"),
        ],
        "12": [
            createExpense("t160", "Summer Vacation Rental", 950.00, [TransactionCategory.TRAVEL], PaymentMethod.MARI_BANK, "June", "12"),
        ],
        "28": [
            createIncome("t161", "Gift from partner", 50.00, [TransactionCategory.GIFT], PaymentMethod.OTHER, "June", "28"),
            createExpense("t162", "Home Decor Purchase", 55.00, [TransactionCategory.SHOPPING], PaymentMethod.VISA, "June", "28"),
        ]
    },
    "July": {
        "1": [
            createExpense("t163", "Rent Payment", 1500.00, [TransactionCategory.RENT], PaymentMethod.BANK_TRANSFER, "July", "1"),
            createExpense("t164", "Mobile Phone Bill", 45.00, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.PAYMAYA, "July", "1"),
        ],
        "15": [
            createIncome("t165", "Salary Deposit", 3500.00, [TransactionCategory.SALARY], PaymentMethod.BANK_TRANSFER, "July", "15"),
            createExpense("t166", "Gas for Road Trip", 80.00, [TransactionCategory.TRANSPORT], PaymentMethod.VISA, "July", "15"),
            createExpense("t167", "Unplanned purchase", 15.00, [TransactionCategory.UNCATEGORIZED], PaymentMethod.CASH, "July", "15"),
        ]
    },
    // --- NEW DUMMY DATA STARTING HERE (August to December 4) ---
    "August": {
        "1": [
            createExpense("t168", "Subscription Renewal", 14.99, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.GCASH, "August", "1"),
            createExpense("t169", "Weekly Groceries", 110.50, [TransactionCategory.SHOPPING, TransactionCategory.FOOD_DRINKS], PaymentMethod.MASTERCARD, "August", "1"),
        ],
        "10": [
            createExpense("t170", "Rent Payment", 1500.00, [TransactionCategory.RENT], PaymentMethod.BANK_TRANSFER, "August", "10"),
            createIncome("t171", "Consulting Fee", 750.00, [TransactionCategory.FREELANCE], PaymentMethod.BANK_TRANSFER, "August", "10"),
        ],
        "22": [
            createExpense("t172", "New Laptop Purchase", 999.00, [TransactionCategory.SHOPPING], PaymentMethod.VISA, "August", "22"),
        ]
    },
    "September": {
        "5": [
            createExpense("t173", "Car Insurance", 180.00, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.MASTERCARD, "September", "5"),
        ],
        "15": [
            createIncome("t174", "Salary Deposit", 3500.00, [TransactionCategory.SALARY], PaymentMethod.BANK_TRANSFER, "September", "15"),
            createExpense("t175", "Dinner at Restaurant", 125.00, [TransactionCategory.FOOD_DRINKS], PaymentMethod.VISA, "September", "15"),
        ],
        "30": [
            createExpense("t176", "Taxes Payment", 250.00, [TransactionCategory.INVESTMENTS], PaymentMethod.BANK_TRANSFER, "September", "30"),
        ]
    },
    "October": {
        "1": [
            createExpense("t177", "Rent Payment", 1500.00, [TransactionCategory.RENT], PaymentMethod.BANK_TRANSFER, "October", "1"),
            createExpense("t178", "Electric Bill", 115.00, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.ATOME, "October", "1"),
        ],
        "18": [
            createIncome("t179", "Bonus Payout", 500.00, [TransactionCategory.SALARY], PaymentMethod.BANK_TRANSFER, "October", "18"),
            createExpense("t180", "Halloween Costumes", 65.50, [TransactionCategory.SHOPPING], PaymentMethod.CASH, "October", "18"),
        ],
        "25": [
            createExpense("t181", "Flight to see family", 320.00, [TransactionCategory.TRAVEL], PaymentMethod.MASTERCARD, "October", "25"),
        ]
    },
    "November": {
        "1": [
            createExpense("t182", "Monthly Investment Deposit", 500.00, [TransactionCategory.INVESTMENTS], PaymentMethod.BANK_TRANSFER, "November", "1"),
        ],
        "15": [
            createIncome("t183", "Salary Deposit", 3500.00, [TransactionCategory.SALARY], PaymentMethod.BANK_TRANSFER, "November", "15"),
            createExpense("t184", "Holiday Decor", 89.99, [TransactionCategory.SHOPPING], PaymentMethod.VISA, "November", "15"),
        ],
        "28": [
            createExpense("t185", "Thanksgiving Groceries", 210.00, [TransactionCategory.FOOD_DRINKS], PaymentMethod.MASTERCARD, "November", "28"),
            createIncome("t186", "Stock Sale Profit", 120.00, [TransactionCategory.INVESTMENTS], PaymentMethod.BANK_TRANSFER, "November", "28"),
        ]
    },
    "December": {
        // Today is December 4, 2025
        "1": [
            createExpense("t187", "Rent Payment", 1500.00, [TransactionCategory.RENT], PaymentMethod.BANK_TRANSFER, "December", "1"),
            createExpense("t188", "Internet/Cable Bill", 79.99, [TransactionCategory.BILLS_UTILITIES], PaymentMethod.MARI_BANK, "December", "1"),
        ],
        "4": [
            createExpense("t189", "Office Supplies", 45.00, [TransactionCategory.SHOPPING], PaymentMethod.GCASH, "December", "4"),
            createExpense("t190", "Lunch Takeout", 18.50, [TransactionCategory.FOOD_DRINKS], PaymentMethod.VISA, "December", "4"),
        ]
    }
};


// -------------------------------------------------------------------
// 🎯 Logic to create the dummyAllTransactions array
// -------------------------------------------------------------------

// (The flattenTransactionLog function remains the same)
const flattenTransactionLog = (log: MonthlyTransactionLog): TransactionItem[] => {
    const allTransactions: TransactionItem[] = [];
    for (const monthName in log) {
        if (log.hasOwnProperty(monthName)) {
            const dailyTransactions = log[monthName];
            for (const day in dailyTransactions) {
                if (dailyTransactions.hasOwnProperty(day)) {
                    allTransactions.push(...dailyTransactions[day]);
                }
            }
        }
    }
    return allTransactions;
};

/**
 * A single, flat array containing all transactions up to December 4, 2025.
 */
const dummyAllTransactions: TransactionItem[] = flattenTransactionLog(dummyTransactionLog);

// Export the data structures
export { dummyAllTransactions, dummyTransactionLog };
