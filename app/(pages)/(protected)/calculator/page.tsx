"use client"

import { CategoryColors, PaymentMethod, PaymentMethodColors, PaymentMethodList, TransactionCategory, TransactionCategoryList } from "@/app/constants/transactions";
import { useAddCalculationsMutation } from "@/app/mutations/add-calculation.mutation";
import { AddCalculationsPayload, TransactionType } from "@/app/types";
import { parseToDateString } from "@/app/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, CornerDownLeftIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from 'react';
import { toast } from "sonner";

interface Day {
    date: number;
    day: string;
    fullDate: Date;
}

/**
 * Utility function to generate the 5-day week data centered around a specific date.
 * @param {Date} centerDate - The date to center the 5-day view around (Today +/- 2 days).
 * @returns {Day[]} The array of 5 days.
 */
const generateWeekData = (centerDate: Date): Day[] => {
    const weekData: Day[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Calculate the date two days before the centerDate
    const startOffset = -2;

    for (let i = startOffset; i <= 2; i++) {
        const date = new Date(centerDate);
        date.setDate(centerDate.getDate() + i);

        weekData.push({
            date: date.getDate(),
            day: dayNames[date.getDay()],
            fullDate: date,
        });
    }

    return weekData;
};

const todayDate = new Date().getDate(); // Get today's date number

const CalculatorPage = () => {
    // State to manage the center of the 5-day view
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    // Use useMemo to recalculate weekData only when currentDate changes
    const weekData: Day[] = useMemo(() => generateWeekData(currentDate), [currentDate]);

    // Format the current month and year for display
    const currentMonthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const [amount, setAmount] = useState<string>('0');
    const [type, setType] = useState<TransactionType>('Expense');
    // Initialize selectedDate to the center date's number
    const [selectedDate, setSelectedDate] = useState<number>(currentDate.getDate());
    const [description, setDescription] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<null | PaymentMethod>(null)

    const { mutate } = useAddCalculationsMutation({
        onSuccess: (newTransaction) => {
            toast("Successfully added transaction")
            handleResetFields();
        },
    })

    const handleResetFields = () => {
        setAmount('0');
        setDescription("")
        setSelectedCategories([])
        setSelectedPaymentMethod(null)
    }

    // --- NAVIGATION HANDLERS ---
    const handlePreviousWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() - 5); // Move back 5 days
            setSelectedDate(newDate.getDate()); // Select the new center day
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + 5); // Move forward 5 days
            setSelectedDate(newDate.getDate()); // Select the new center day
            return newDate;
        });
    };
    // --------------------------

    const handleNumberClick = (value: string) => {
        setAmount(prevAmount => {
            if (prevAmount === '0') {
                return value === '.' ? '0.' : value;
            }

            if (value === '.') {
                if (prevAmount.includes('.')) {
                    return prevAmount;
                }
                return prevAmount + value;
            }

            let newAmount = prevAmount + value;

            if (newAmount.replace('.', '').length > 9) {
                return prevAmount;
            }

            if (newAmount.includes('.')) {
                const parts = newAmount.split('.');
                if (parts[1].length > 2) {
                    return prevAmount;
                }
            }

            return newAmount;
        });
    };

    const handleSubmit = () => {
        if (selectedPaymentMethod) {
            const finalAmount = parseFloat(amount).toFixed(2);

            const payload: AddCalculationsPayload = {
                amount: parseFloat(finalAmount),
                date: parseToDateString(weekData.find(d => d.date === selectedDate)?.fullDate || new Date()),
                type,
                description,
                categories: selectedCategories,
                paymentMethod: selectedPaymentMethod,
            }

            console.log(payload)
            // mutate(payload)
        }
    };

    const handleClear = () => {
        setAmount(prevAmount => {
            if (prevAmount === '0') return prevAmount;

            let newAmount = prevAmount.slice(0, -1);

            if (newAmount === '' || newAmount === '.') {
                return '0';
            }

            if (newAmount === '0') {
                return '0';
            }

            return newAmount;
        });
    };
    const handleRemoveSelectedCategory = (c: TransactionCategory) => {
        const filtered = selectedCategories.filter((d) => d !== c);
        setSelectedCategories(filtered);
    }

    let displayAmount = amount;

    const DateButton = ({ dayData }: { dayData: Day }) => {
        const isSelected = selectedDate === dayData.date;
        const isToday = dayData.date === new Date().getDate(); // Check against true today

        const baseClasses = "px-1 py-2 w-16 h-20 rounded flex flex-col justify-center items-center -gap-0.5 transition-colors duration-150 relative overflow-hidden";
        const activeClasses = "text-primary-foreground ring-2 ring-primary/50";
        const inactiveClasses = `shadow-md bg-white text-gray-700 hover:bg-gray-100 ${isToday ? 'border-2 border-primary/50' : ''}`;

        return (
            <motion.button
                type="button"
                className={`transition-all ease-in-out ${baseClasses} ${isSelected ? activeClasses : inactiveClasses}`}
                onClick={() => setSelectedDate(dayData.date)}
                whileTap={{ scale: 0.95 }}
            >
                {/* Moving Background Highlight for Selected Date (Advanced) */}
                {isSelected && (
                    <motion.div
                        layoutId="selectedDate"
                        className="absolute inset-0 rounded bg-primary"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                )}
                <p className={`text-xs font-medium z-10 ${isSelected ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                    {isToday && dayData.date === new Date().getDate() ? 'Today' : dayData.day}
                </p>
                <h3 className="font-semibold text-3xl mt-[-4px] z-10">{dayData.date}</h3>
            </motion.button>
        );
    };

    const numberLayout = [
        '7', '8', '9',
        '4', '5', '6',
        '1', '2', '3',
    ];

    return (
        <div className="flex flex-col h-full pt-6 gap-4">

            {/* Expense/Income Selector */}
            <section className="mx-auto space-x-2">
                <Button
                    type="button"
                    variant={type === 'Expense' ? 'default' : 'ghost'}
                    onClick={() => setType('Expense')}
                >
                    Expense
                </Button>
                <Button
                    type="button"
                    variant={type === 'Income' ? 'default' : 'ghost'}
                    onClick={() => setType('Income')}
                >
                    Income
                </Button>
            </section>

            <hr className="w-full border-t border-gray-200" />

            {/* Month/Year Display */}
            <motion.h2
                key={currentMonthYear} // Animate on month/year change
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center text-lg font-semibold text-gray-800"
            >
                {currentMonthYear}
            </motion.h2>

            {/* Date Selector with Navigation */}
            <section className="flex justify-center items-center gap-1.5 px-4">
                {/* Left Arrow Button */}
                <motion.button
                    type="button"
                    onClick={handlePreviousWeek}
                    className="p-3 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition-colors"
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </motion.button>

                {/* Date Buttons */}
                {weekData.map((day) => (
                    <DateButton key={day.fullDate.toISOString()} dayData={day} />
                ))}

                {/* Right Arrow Button */}
                <motion.button
                    type="button"
                    onClick={handleNextWeek}
                    className="p-3 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition-colors"
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </motion.button>
            </section>

            <hr className="w-full border-t border-gray-200" />

            {/* Amount Display */}
            <section className="py-2 pb-4 flex justify-center items-center">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.h1
                        key={amount} // ANIMATE ON AMOUNT CHANGE
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.15 }}
                        className="text-6xl text-primary font-bold font-mono break-all text-center"
                    >
                        {displayAmount}
                    </motion.h1>
                </AnimatePresence>
            </section>

            <section className="px-6">
                <InputGroup className="bg-background">
                    <InputGroupTextarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Groceries for the month..." />
                    <InputGroupAddon align="block-end">
                        <div className="flex justify-start items-center gap-2 flex-wrap">

                            {/* Category Dropdown (No animation needed here, just its content) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <InputGroupButton variant="ghost" className="flex justify-center items-center gap-1">
                                        <PlusIcon />
                                        <span>Category</span>
                                    </InputGroupButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    align="start"
                                    className="[--radius:0.95rem]"
                                >
                                    {TransactionCategoryList.map((c) => {
                                        return (
                                            <DropdownMenuItem
                                                key={c}
                                                onClick={() => setSelectedCategories(prev => [...prev, c])}
                                                className="flex items-center gap-2 font-medium"
                                            >
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CategoryColors[c] }} />
                                                {c}
                                            </DropdownMenuItem>
                                        )
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* ANIMATE BADGES ON ADD/REMOVE */}
                            <AnimatePresence mode="popLayout">
                                {selectedCategories.map((c, i) => {
                                    return (
                                        <motion.div
                                            key={c} // Key is essential for AnimatePresence
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                            className="inline-block"
                                        >
                                            <Badge onClick={() => handleRemoveSelectedCategory(c)} style={{ backgroundColor: CategoryColors[c] }} key={`selected-category-${c}-${i}`}>{c}</Badge>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>

                            {/* Payment Method Dropdown (No animation needed here, just its content) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="ml-auto">
                                    {selectedPaymentMethod ? (
                                        <Badge className="flex justify-center items-center gap-1"
                                            style={{ backgroundColor: PaymentMethodColors[selectedPaymentMethod] }}>
                                            <span>{selectedPaymentMethod}</span>
                                        </Badge>
                                    ) : (
                                        <InputGroupButton variant="ghost" className="flex justify-center items-center gap-1">
                                            <span>Payment</span>
                                        </InputGroupButton>
                                    )}

                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    align="start"
                                    className="[--radius:0.95rem]"
                                >
                                    {PaymentMethodList.map((c) => {
                                        return (
                                            <DropdownMenuItem
                                                key={c}
                                                onClick={() => setSelectedPaymentMethod(c)}
                                                className="flex items-center gap-2 font-medium"
                                            >
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PaymentMethodColors[c] }} />
                                                {c}
                                            </DropdownMenuItem>
                                        )
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </InputGroupAddon>
                </InputGroup>
            </section>

            {/* Number Pad */}
            <section className="grid grid-cols-3 px-6 grid-rows-4 gap-2 items-center flex-1 pb-6">
                {/* Numbers 7-1, in 3x3 layout */}
                {numberLayout.map(num => (
                    <motion.button
                        key={num}
                        type="button"
                        onClick={() => handleNumberClick(num)}
                        className="text-2xl font-mono h-16"
                        whileTap={{ scale: 0.95 }}
                    >
                        {num}
                    </motion.button>
                ))}

                {/* Clear/Delete Button (Backspace) */}
                <motion.button
                    type="button"
                    onClick={handleClear}
                    // variant="outline"
                    className="flex justify-center items-center"
                    whileTap={{ scale: 0.95 }}
                >
                    <CornerDownLeftIcon className="w-6 h-6" />
                </motion.button>


                {/* Zero Button */}
                <motion.button
                    type="button"
                    onClick={() => handleNumberClick('0')}
                    className="text-2xl font-mono h-16"
                    whileTap={{ scale: 0.95 }}
                >
                    0
                </motion.button>

                {/* Decimal Button */}
                <motion.button
                    type="button"
                    onClick={() => handleNumberClick('.')}
                    className="text-2xl font-mono h-16"
                    whileTap={{ scale: 0.95 }}
                >
                    .
                </motion.button>

                {/* Submit/Check Button (occupies a full row below) */}
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="text-2xl font-mono h-16 col-span-3 mt-2"
                // whileTap={{ scale: 0.98 }}
                >
                    Submit
                </Button>
            </section>
        </div>
    )
}

export default CalculatorPage