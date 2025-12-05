//month.card.tsx
import { DailyTransactions } from '../types';
import { formatAmount, getDayDate } from '../utils';
import DayCard from './day-card';
// 1. Import motion AND Variants
import { motion, Variants } from 'framer-motion';

interface IProps {
    month: string;
    dates: DailyTransactions;
    onToggleSelect: (id: string, isSelected: boolean) => void;
    selectedTransactionIds: string[]
}
const MonthCard = ({ month, dates, onToggleSelect, selectedTransactionIds }: IProps) => {

    let total = 0;

    Object.entries(dates).forEach(([, transactions]) => {
        transactions.forEach((transaction) => {
            const amount = transaction.amount;

            if (transaction.type === 'Income') {
                total += amount;
            } else if (transaction.type === 'Expense') {
                total -= amount;
            }
        });
    });

    const totalClassName = total >= 0 ? 'text-green-600' : 'text-red-600';
    const sign = total >= 0 ? '+' : '-';
    const absoluteTotal = Math.abs(total);

    // 2. Define the item variant, explicitly typing it as Variants
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                // 3. FIX: Change 'type: "spring"' to 'type: "spring"' (literal string)
                type: 'spring',
                stiffness: 100,
                damping: 20
            }
        },
    };

    return (
        // 4. Use motion.li and apply the variant
        <motion.li
            className=""
            variants={itemVariants} // <-- Applied to the list item
        >
            <div className="shadow-sm z-10 bg-background sticky top-12 w-full px-4 py-4 flex justify-between items-end h-16">
                <h1 className="text-3xl font-bold text-left">{month}</h1>

                <p className={`text-xl font-bold ${totalClassName}`}>
                    {sign}{formatAmount(absoluteTotal, { showCurrency: true })}
                </p>
            </div>

            <div className="w-full space-y-2 px-2">
                {/* Iterate over days */}
                {Object.entries(dates).map(([day, data]) => {
                    // Only render DayCard if there are transactions for the day
                    if (data.length === 0) return null;

                    const currentDate = getDayDate(month, day);
                    return (
                        <DayCard
                            key={`${month}-${day}`}
                            data={data}
                            date={currentDate}
                            selectedTransactionIds={selectedTransactionIds}
                            onToggleSelect={onToggleSelect}
                        />
                    );
                })}
            </div>
        </motion.li>
    );
};

export default MonthCard