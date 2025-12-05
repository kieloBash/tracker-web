// TransactionSwipeItem.tsx

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryColors, PaymentMethodColors, TransactionCategory } from '../constants/transactions';
import { TransactionItem } from '../types';
import { formatAmount } from '../utils';

// The LONG_PRESS_DURATION and useRef for the timer are no longer needed.

type TransactionSwipeItemProps = {
    transaction: TransactionItem;
    onToggleSelect: (id: string, isSelected: boolean) => void;
    isSelected: boolean;
};

const TransactionSwipeItem = ({ transaction, onToggleSelect, isSelected }: TransactionSwipeItemProps) => {
    const { id, amount, categories, description, type, paymentMethod } = transaction;

    const primaryCategory = categories[0] as TransactionCategory;
    const categoryColor = CategoryColors[primaryCategory];
    const paymentColor = PaymentMethodColors[paymentMethod];

    const amountClassName = cn(
        "text-lg font-bold whitespace-nowrap",
        type === "Expense" && "text-red-600",
        type === "Income" && "text-green-600",
    );
    const formattedAmount = `${type === "Expense" ? '-' : '+'}${formatAmount(amount)}`;

    // --- Click-to-Select Logic ---

    // Handle the click event to toggle selection
    const handleClick = () => {
        // Toggle the selection state by calling the prop function
        onToggleSelect(id, !isSelected);
    };

    // --- Component Structure & Styling ---

    // Determine the styling based on the selection state (same as previous version)
    const itemVisuals = cn(
        "flex justify-between items-center py-2 px-2 rounded-lg relative z-[5] transition-all duration-200 cursor-pointer",
        isSelected
            ? "bg-blue-50 border border-blue-400 shadow-sm scale-[1.02]" // Selected style
            : "bg-white border border-gray-50 shadow-xl" // Normal style
    );

    return (
        // The container now only needs the onClick handler
        <div
            key={id}
            className="relative"
            onClick={handleClick}
        // All pointer/drag handlers are removed
        >
            {/* Transaction Item Card */}
            <motion.div
                className={itemVisuals}
                // Optional: You can add a slight press effect for better feedback
                whileTap={{ scale: isSelected ? 1.02 : 0.98 }}
            >
                {/* Selection Indicator on the Left (Animated) */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isSelected ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-blue-500 rounded-l-lg"
                >
                    <CheckCircle className="h-4 w-4 text-white" />
                </motion.div>

                {/* Left Side: Description, Category, and Payment Method 
                    (Adjusted padding when selected to make space for the checkmark) 
                */}
                <div className={cn("flex flex-col overflow-hidden mr-4 transition-all duration-200", isSelected ? 'ml-8' : 'ml-0')}>
                    <h2 className="text-gray-900 font-medium truncate">{description}</h2>

                    {/* Categories and Payment Method Row */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {/* Primary Category Chip */}
                        <div className="flex items-center gap-1">
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: categoryColor }}
                            />
                            <span className="capitalize text-[11px]">{primaryCategory}</span>
                        </div>

                        {/* Separator */}
                        <span className="text-gray-300">•</span>

                        {/* Payment Method Chip */}
                        <div className="flex items-center gap-1">
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: paymentColor }}
                            />
                            <span className="capitalize text-[11px]">{paymentMethod}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Amount */}
                <h3 className={amountClassName}>{formattedAmount}</h3>
            </motion.div>
        </div>
    );
}

export default TransactionSwipeItem;