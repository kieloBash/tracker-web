import {
    Banknote,
    Briefcase,
    Car,
    Gift,
    HeartPulse,
    HelpCircle,
    Home,
    LucideIcon,
    Plane,
    Receipt,
    ShoppingBag,
    TrendingUp,
    Utensils,
    Wallet,
} from 'lucide-react';

export enum TransactionCategory {
    // --- Expense Categories (Money going out) ---
    SHOPPING = "Shopping",
    FOOD_DRINKS = "Food & Drinks",
    TRANSPORT = "Transport",
    BILLS_UTILITIES = "Bills & Utilities",
    RENT = "Rent/Mortgage",
    TRAVEL = "Travel",
    HEALTH = "Health",

    // --- Income Categories (Money coming in) ---
    SALARY = "Salary",
    INVESTMENTS = "Investments",
    FREELANCE = "Freelance/Side Job",
    GIFT = "Gift",

    // --- General/Other Categories ---
    OTHER_INCOME = "Other Income",
    UNCATEGORIZED = "Uncategorized",
}

// Ensure this list only includes the string values of the enum
export const TransactionCategoryList = Object.values(TransactionCategory);

/**
 * Maps each TransactionCategory to a corresponding LucideIcon component.
 */
export const CategoryIcons: Record<TransactionCategory, LucideIcon> = {
    // Expense Icons
    [TransactionCategory.SHOPPING]: ShoppingBag,
    [TransactionCategory.FOOD_DRINKS]: Utensils,
    [TransactionCategory.TRANSPORT]: Car,
    [TransactionCategory.BILLS_UTILITIES]: Receipt,
    [TransactionCategory.RENT]: Home,
    [TransactionCategory.TRAVEL]: Plane,
    [TransactionCategory.HEALTH]: HeartPulse,

    // Income Icons
    [TransactionCategory.SALARY]: Banknote,
    [TransactionCategory.INVESTMENTS]: TrendingUp,
    [TransactionCategory.FREELANCE]: Briefcase,
    [TransactionCategory.GIFT]: Gift,

    // General/Other Icons
    [TransactionCategory.OTHER_INCOME]: Wallet,
    [TransactionCategory.UNCATEGORIZED]: HelpCircle,
};

// --- Category to Color Mapping ---

/**
 * Maps each TransactionCategory to a unique hexadecimal color code.
 * Expense colors often use warmer or more saturated tones (like reds/oranges).
 * Income colors often use cooler or more calming tones (like greens/blues).
 */
export const CategoryColors: Record<TransactionCategory, string> = {
    // Expense Colors (Warm/Red Tones)
    [TransactionCategory.SHOPPING]: "#FF6384",  // Pink-Red
    [TransactionCategory.FOOD_DRINKS]: "#FF9F40", // Orange
    [TransactionCategory.TRANSPORT]: "#FFCD56", // Yellow-Orange
    [TransactionCategory.BILLS_UTILITIES]: "#4BC0C0", // Cyan/Teal
    [TransactionCategory.RENT]: "#A32C2C", // Dark Red/Maroon
    [TransactionCategory.TRAVEL]: "#9966FF", // Purple
    [TransactionCategory.HEALTH]: "#C9CB30", // Olive Green

    // Income Colors (Cool/Green Tones)
    [TransactionCategory.SALARY]: "#36A2EB", // Bright Blue
    [TransactionCategory.INVESTMENTS]: "#2E8B57", // Sea Green
    [TransactionCategory.FREELANCE]: "#00CED1", // Dark Turquoise
    [TransactionCategory.GIFT]: "#6A5ACD", // Slate Blue

    // General/Other Colors (Neutral Tones)
    [TransactionCategory.OTHER_INCOME]: "#778899", // Light Slate Gray
    [TransactionCategory.UNCATEGORIZED]: "#B3B3B3", // Light Gray
};

/**
 * TypeScript Enum for common Payment Method types.
 * Used for tagging transactions based on how the money was moved.
 */
export enum PaymentMethod {
    VISA = "Visa",
    MASTERCARD = "Mastercard",
    CASH = "Cash",
    BANK_TRANSFER = "Bank Transfer",
    ATOME = "Atome",
    GCASH = "GCash",
    MARI_BANK = "MariBank", // Targeted for Orange
    PAYMAYA = "PayMaya",   // Targeted for Green
    OTHER = "Other Method",
}

// Ensure this list only includes the string values of the enum
export const PaymentMethodList = Object.values(PaymentMethod);

/**
 * Maps each PaymentMethod to a unique hexadecimal color code
 * for use in filters or transaction visualizations.
 */
export const PaymentMethodColors: Record<PaymentMethod, string> = {
    // Card/Digital Methods
    [PaymentMethod.VISA]: "#1E41B8",         // Strong Blue
    [PaymentMethod.MASTERCARD]: "#FF6900",   // Vivid Orange (Original)
    [PaymentMethod.GCASH]: "#009CDE",       // Bright Cyan
    [PaymentMethod.ATOME]: "#A2AAAD",        // Light Gray (Silver)

    // --- ADJUSTED COLORS ---
    [PaymentMethod.MARI_BANK]: "#FFA500",     // Bright Orange (Updated)
    [PaymentMethod.PAYMAYA]: "#008000",      // Dark Green (Updated)
    // --- END ADJUSTED COLORS ---

    // Physical/Transfer Methods
    [PaymentMethod.CASH]: "#4CAF50",         // Medium Green 
    [PaymentMethod.BANK_TRANSFER]: "#607D8B", // Blue Gray
    [PaymentMethod.OTHER]: "#BDBDBD",        // Pale Gray
};