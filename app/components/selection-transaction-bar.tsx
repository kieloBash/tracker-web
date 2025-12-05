"use client"

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from "lucide-react";

interface IProps {
    selectedTransactionIds: string[];
    setSelectedTransactionIds: React.Dispatch<React.SetStateAction<string[]>>;
    totalTransactionCount: number;
}

const SelectionTransactionBar = ({ selectedTransactionIds, setSelectedTransactionIds, totalTransactionCount = 0 }: IProps) => {
    // Check if any transactions are selected
    const isSelectionActive = selectedTransactionIds.length > 0;
    const selectedCount = selectedTransactionIds.length;
    const isAllSelected = selectedCount === totalTransactionCount && totalTransactionCount > 0;

    const handleSelectAll = () => {
        if (!isAllSelected) {
            const allIds = Array.from({ length: totalTransactionCount }, (_, i) => `id-${i + 1}`);
            setSelectedTransactionIds(allIds);
        }
    };

    const handleUnselectAll = () => {
        setSelectedTransactionIds([]);
    };

    const selectionBarVariants = {
        initial: { y: '-100%', opacity: 0 },
        animate: { y: '0%', opacity: 1 },
        exit: { y: '-100%', opacity: 0 },
    };

    return (
        <>
            {isSelectionActive && (
                <section className="w-full fixed top-0 z-[30] h-12 bg-background border-b flex items-center">
                    <AnimatePresence>
                        <motion.div
                            key="selection-bar"
                            variants={selectionBarVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-primary/95 text-primary-foreground flex items-center justify-between px-4 md:px-6 w-full h-full z-[25]"
                        >
                            {/* Left Side: Count and Unselect Button */}
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-white/10"
                                    onClick={handleUnselectAll}
                                >
                                    <XIcon className="h-4 w-4 text-primary-foreground" />
                                </Button>
                                <span className="font-semibold">{selectedCount} Selected</span>
                            </div>

                            {/* Right Side: Actions (e.g., Select All, Bulk Delete) */}
                            <div className="flex items-center space-x-2">
                                {/* Select All Button */}
                                {totalTransactionCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 hover:bg-white/10"
                                        onClick={isAllSelected ? handleUnselectAll : handleSelectAll}
                                        disabled={isAllSelected && selectedCount === 0} // Disable if 0/0 or 0/N
                                    >
                                        {isAllSelected ? 'Unselect All' : `Select All (${totalTransactionCount})`}
                                    </Button>
                                )}

                                {/* Placeholder for Bulk Action (e.g., Delete) */}
                                <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700">
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </section>
            )}
        </>
    );
};

export default SelectionTransactionBar;