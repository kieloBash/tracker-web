"use client"

import MonthCard from "@/app/components/month-card";
import SelectionTransactionBar from "@/app/components/selection-transaction-bar";
import TransactionFilterSection from "@/app/components/transactions-filter";
import { dummyTransactionLog } from "@/app/constants/dummy-logs";
import { MonthlyTransactionLog } from "@/app/types";
import { useState } from "react";
// 1. Import motion
import { motion } from "framer-motion";

const TransactionsPage = () => {

    const [data, setData] = useState<MonthlyTransactionLog>(dummyTransactionLog)
    const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([])

    const onToggleSelect = (id: string, isSelected: boolean) => {
        if (isSelected)
            setSelectedTransactionIds((prev) => [...prev, id])
        else {
            setSelectedTransactionIds((prev) => prev.filter((d) => d !== id))
        }
    }

    // 2. Define animation variants for the main page
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                // Stagger children for a cascading effect on MonthCards
                staggerChildren: 0.05,
                when: "beforeChildren",
                duration: 0.5,
            }
        },
    };

    return (
        // 3. Apply the motion component and variants
        <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <SelectionTransactionBar
                totalTransactionCount={100}
                selectedTransactionIds={selectedTransactionIds}
                setSelectedTransactionIds={setSelectedTransactionIds}
            />
            <TransactionFilterSection />
            <section className="">
                <ul className="">
                    {Object.entries(data).map(([monthName, dates]) => {
                        return (
                            <MonthCard
                                key={monthName}
                                month={monthName}
                                dates={dates}
                                onToggleSelect={onToggleSelect}
                                selectedTransactionIds={selectedTransactionIds}
                            />
                        )
                    })}
                </ul>
            </section>
        </motion.div>
    )
}

export default TransactionsPage