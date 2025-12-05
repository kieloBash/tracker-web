//day.card.tsx
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TransactionItem } from '../types';
import TransactionSwipeItem from './transaction-swipe-item';
// 1. Import motion and Variants
import { motion, Variants } from 'framer-motion';
import { formatAmount } from '../utils';

interface IProps {
    data: TransactionItem[];
    date: Date | null;
    onToggleSelect: (id: string, isSelected: boolean) => void;
    selectedTransactionIds: string[]
}
const DayCard = ({ data, date, onToggleSelect, selectedTransactionIds }: IProps) => {

    if (!date || data.length === 0) {
        return null;
    }

    // --- Daily Net Total Calculation ---
    const dailyNetTotal = data.reduce((sum, transaction) => {
        return sum + (transaction.type === 'Income' ? transaction.amount : -transaction.amount);
    }, 0);

    const totalClassName = cn(
        "text-lg font-bold ml-auto",
        dailyNetTotal >= 0 ? "text-green-700" : "text-red-700"
    );

    // 2. Define the animation variants for scroll
    const dayCardVariants: Variants = {
        // Initial state (hidden and slightly below)
        hidden: {
            opacity: 0,
            y: 20,
            transition: { duration: 0.5 } // Keep transition here for initial load fade
        },
        // Visible state (fades in and moves up)
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20
            }
        },
    };

    return (
        // 3. Replace <div> with <motion.div> and apply whileInView
        <motion.div
            className="w-full flex gap-2 px-2 relative pb-4 border-b border-gray-200 last:border-b-0"
            variants={dayCardVariants}
            initial="hidden"
            whileInView="visible" // Triggers when entering the viewport
            viewport={{
                once: true, // Only animate once when it first appears
                amount: 0.3 // Trigger when 30% of the item is visible
            }}
        >

            {/* 1. Date Column (Sticky) */}
            <div className="w-10 h-full py-2 sticky top-[7rem] flex flex-col items-center justify-start">
                <div className="flex justify-center items-center flex-col">
                    <h4 className="text-xl capitalize font-extrabold text-gray-800">{format(date, "dd")}</h4>
                    <p className="capitalize text-xs mt-[-4px] text-gray-500 font-semibold">{format(date, "EEE")}</p>
                </div>
            </div>

            {/* 2. Transactions Column */}
            <div className="flex-1 space-y-2 py-2">

                {/* Daily Total Header */}
                <div className="flex justify-between items-center mb-3 pb-1 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-600">Daily Net</p>
                    <p className={totalClassName}>
                        {dailyNetTotal >= 0 ? '+' : ''}{formatAmount(dailyNetTotal)}
                    </p>
                </div>

                {/* Individual Transactions */}
                <div className="space-y-3">
                    {data.map((transaction) => {
                        const isSelected = selectedTransactionIds.find((d) => d === transaction.id) ? true : false
                        return (
                            <TransactionSwipeItem
                                key={transaction.id}
                                transaction={transaction}
                                isSelected={isSelected}
                                onToggleSelect={onToggleSelect}
                            />
                        )
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default DayCard