'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { Clock, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react';
import { formatAmount } from '../utils'

// 1. Define the component props, including todaySpentAmount
interface BudgetAnalyticsCardProps {
    budgetLimit: number;
    spentAmount: number;
    todaySpentAmount: number; // New prop for today's spending
    title?: string;
    // Mock data for average/remaining days for demo
    daysInMonth?: number;
    currentDay?: number;
}

// 2. Define possible metrics to display, including 'todaySpent'
type DisplayMetric = 'left' | 'spent' | 'dailyAvg' | 'todaySpent';

const BudgetAnalyticsCard = ({
    budgetLimit,
    spentAmount,
    todaySpentAmount, // Destructure the new prop
    title = "Monthly Budget",
    daysInMonth = 30, // Assume 30 days for mock
    currentDay = 15 // Assume current day is 15 for mock
}: BudgetAnalyticsCardProps) => {

    const [displayMetric, setDisplayMetric] = useState<DisplayMetric>('left');

    const amountLeft = budgetLimit - spentAmount;
    const daysRemaining = daysInMonth - currentDay + 1;
    const dailyAverageRequired = amountLeft >= 0 ? amountLeft / daysRemaining : 0;
    const percentageSpent = (spentAmount / budgetLimit) * 100;

    // Clamp the percentage for the progress bar (max 100%)
    const progressValue = Math.min(percentageSpent, 100);

    // --- Budget Health Logic ---
    let progressColor = "bg-green-400";
    let indicatorIcon = <TrendingUp className="w-5 h-5 mr-1" />;
    let statusText = "On Track";
    let textColor = "text-green-300";

    if (percentageSpent >= 100) {
        progressColor = "bg-red-500";
        indicatorIcon = <TrendingDown className="w-5 h-5 mr-1" />;
        statusText = "Over Budget";
        textColor = "text-red-400";
    } else if (percentageSpent >= 80) {
        progressColor = "bg-yellow-500";
        indicatorIcon = <Clock className="w-5 h-5 mr-1" />;
        statusText = "Approaching Limit";
        textColor = "text-yellow-300";
    }

    // --- Dynamic Display Content ---
    let mainValue: string;
    let mainLabel: string;
    let showSign = true;

    switch (displayMetric) {
        // 3. Add new case for 'todaySpent'
        case 'todaySpent':
            mainValue = formatAmount(todaySpentAmount, { showCurrency: false });
            mainLabel = "Today's Spend";
            showSign = false;
            break;
        case 'spent':
            mainValue = formatAmount(spentAmount, { showCurrency: false });
            mainLabel = 'Total Spent';
            showSign = false;
            break;
        case 'dailyAvg':
            mainValue = formatAmount(dailyAverageRequired, { showCurrency: false, });
            mainLabel = `Daily Avg. Left (${daysRemaining} days)`;
            showSign = true;
            break;
        case 'left':
        default:
            // Ensure we handle negative values correctly for display
            mainValue = formatAmount(Math.abs(amountLeft), { showCurrency: false, decimalPlaces: 2 });
            mainLabel = amountLeft >= 0 ? 'Budget Left' : 'Amount Over';
            showSign = amountLeft < 0; // Only show '-' sign if amountLeft is negative
            break;
    }

    // 4. Update the metricOptions array
    const metricOptions: { key: DisplayMetric, label: string }[] = [
        { key: 'left', label: amountLeft >= 0 ? 'LEFT' : 'OVER' },
        { key: 'spent', label: 'SPENT' },
        { key: 'todaySpent', label: 'TODAY' }, // New option
        { key: 'dailyAvg', label: 'DAILY AVG' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', damping: 15, stiffness: 100 }}
            className="w-full shadow-xl border rounded-xl"
        >
            <Card className="w-full shadow-xl bg-primary border-primary/50 p-2">
                <CardContent className="p-4 sm:p-6 text-primary-foreground">

                    {/* Title and Health Status (Compact) */}
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-xl font-medium">{title}</p>
                        <div className={`flex items-center text-sm font-semibold ${textColor}`}>
                            {indicatorIcon}
                            {statusText}
                        </div>
                    </div>

                    {/* Main Dynamic Amount Display */}
                    <div className="text-center">
                        <p className="text-lg mb-1 text-primary-foreground/80 font-mono">
                            {mainLabel}
                        </p>
                        <motion.div
                            key={mainValue} // Re-animate on metric change
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex justify-center items-end"
                        >
                            <h1 className="text-5xl sm:text-6xl font-mono font-bold">
                                {/* Display the sign only for 'Amount Over' */}
                                {showSign && amountLeft < 0 ? '-' : ''}{mainValue}
                            </h1>
                        </motion.div>
                    </div>

                    {/* Progress Bar */}
                    <Progress
                        className="w-full h-3 mt-4 bg-primary-foreground/30"
                        indicatorClassName={progressColor}
                        value={progressValue}
                    />

                    {/* Footer Metrics & Toggle */}
                    <div className="mt-3 flex justify-between items-center text-sm text-primary-foreground/80 pt-1 border-t border-primary-foreground/20">

                        {/* Static Totals */}
                        <div className="flex flex-col text-xs sm:text-sm">
                            <p>Total: {formatAmount(budgetLimit)}</p>
                            <p className="mt-0.5">Spent: {formatAmount(spentAmount)}</p>
                        </div>

                        {/* Dynamic Metric Toggle */}
                        <div className="flex gap-2 flex-wrap justify-end">
                            {metricOptions.map(option => (
                                <motion.button
                                    key={option.key}
                                    onClick={() => setDisplayMetric(option.key)}
                                    className={`px-2 py-1 text-xs font-bold rounded-full transition-colors ${displayMetric === option.key
                                        ? 'bg-primary-foreground text-primary'
                                        : 'text-primary-foreground/60 hover:text-primary-foreground'
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {option.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default BudgetAnalyticsCard