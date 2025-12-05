import { format } from "date-fns";

export const parseToDateString = (d: Date, pattern?: string) => {
    return pattern ? format(d, pattern) : format(d, "MM-dd-yyyy");
}

export const getMonthYearKey = (date: Date): string => {
    // 'MMMM yyyy' formats the date as full month name followed by the year
    return format(date, 'MMMM yyyy');
};

export function getDayDate(monthName: string, dayNumber: string) {
    // 1. Get the current year
    const currentYear = new Date().getFullYear();

    // 2. Format the date string as "YYYY-Month Day" (e.g., "2025-January 1")
    // This format is generally well-parsed by the Date constructor.
    const dateString = `${currentYear}-${monthName} ${dayNumber}`;

    // 3. Create and return the Date object
    const dateValue = new Date(dateString);

    // Optional check: Ensure the date is valid (i.e., not "Invalid Date")
    if (isNaN(dateValue.getTime())) {
        return null;
    }

    return dateValue;
}

/**
 * Formats a string or number into a Philippine Peso currency string.
 *
 * @param amount The value to format (string or number).
 * @param options Configuration for the formatting.
 * @returns The formatted currency string (e.g., "₱1,000.00").
 */
export function formatAmount(
    amount: string | number,
    options?: {
        showCurrency?: boolean;
        decimalPlaces?: number;
    }
): string {
    // 1. Convert amount to a number
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Handle invalid or non-finite inputs
    if (isNaN(numericAmount) || !isFinite(numericAmount)) {
        return options?.showCurrency ? '₱0.00' : '0.00';
    }

    // 2. Determine formatting options
    const defaultDecimalPlaces = 2;
    const showCurrency = options?.showCurrency ?? true; // Default to showing peso sign
    const decimalPlaces = options?.decimalPlaces ?? defaultDecimalPlaces;

    // 3. Use Intl.NumberFormat for locale-aware formatting
    const formatter = new Intl.NumberFormat('en-PH', {
        // Use 'en-PH' for Philippines locale standards
        style: showCurrency ? 'currency' : 'decimal',
        currency: 'PHP', // Philippine Peso
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });

    let formatted = formatter.format(numericAmount);

    // If style was 'decimal', we manually prepend '₱' if requested
    if (!showCurrency && options?.showCurrency) {
        formatted = '₱' + formatted;
    }

    // If style was 'currency', Intl might use a different locale format (e.g., "PHP 1,000.00")
    // We ensure it starts with the correct symbol '₱' for the typical format
    if (showCurrency && formatted.startsWith('PHP')) {
        formatted = formatted.replace('PHP', '₱');
    }

    // Note: For 'en-PH' locale, Intl.NumberFormat usually returns "₱1,000.00" directly,
    // but the manual adjustments ensure consistency.

    return formatted;
}