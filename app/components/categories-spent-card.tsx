import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ChevronDown, Pencil, X } from 'lucide-react'; // Added Plus, Pencil, X icons
import React from 'react';

import {
    CategoryColors,
    CategoryIcons,
    TransactionCategory,
} from '@/app/constants/transactions';
import { cn } from '@/lib/utils';
import { CategoryBudget } from '../types';
import { formatAmount } from '../utils';

// Framer Motion variants for staggered list entry
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

// --- Sub-Component for Progress Bar ---
const ProgressBar: React.FC<{ spent: number; allocated: number }> = ({ spent, allocated }) => {
    // Calculate percentage, capped at 100% for the visual width
    const percentage = Math.min(100, (spent / allocated) * 100);

    // Color logic (Red for over, Yellow for close, Indigo for good)
    const progressColor =
        spent > allocated
            ? 'bg-red-500'
            : percentage > 75
                ? 'bg-yellow-500'
                : 'bg-green-500';

    return (
        <div className="h-2 bg-gray-200 rounded-full w-full mt-1 overflow-hidden">
            <motion.div
                className={`h-full rounded-full ${progressColor}`}
                initial={{ width: '0%' }}
                // Animate the width based on the percentage
                animate={{ width: `${percentage}%` }}
                transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 0.3
                }}
            />
        </div>
    );
};

// --- Sub-Component for Individual Category Item ---
// Added onEditClick prop to handle editing in the detail view
const CategoryItem: React.FC<{ category: CategoryBudget, isEditing: boolean }> = ({ category, isEditing }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Retrieve the Icon and Color Class based on the categoryName
    const Icon = CategoryIcons[category.categoryName];
    const colorClass = CategoryColors[category.categoryName];

    const remaining = category.allocated - category.spent;
    const isOverBudget = remaining < 0;
    const percentage = Math.min(100, (category.spent / category.allocated) * 100);

    // Placeholder function for editing the budget amount
    const handleEditAllocation = (categoryName: TransactionCategory) => {
        alert(`TODO: Implement modal/form to edit allocation for ${categoryName}`);
    };

    return (
        <motion.div
            layout // Smooth layout transitions for accordion effect
            className="p-4 border-b border-gray-100 last:border-b-0"
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            {/* Header/Summary Area - Clickable */}
            <motion.div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.98 }}
                layout
            >
                {/* Left: Icon and Name */}
                <div className="flex items-center">
                    {/* Category Color Applied Here */}
                    <div className={`p-2 rounded-full mr-3`} style={{ backgroundColor: colorClass }}>
                        <Icon size={20} />
                    </div>
                    <span className="font-semibold text-gray-800">
                        {category.categoryName}
                    </span>
                </div>

                {/* Right: Spent Amount and Toggle Icon */}
                <div className="flex items-center">
                    <span className={cn("text-lg font-bold mr-3 text-gray-900")}>
                        {formatAmount(category.spent)}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={18} className="text-gray-500" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Detailed Breakdown - Animated Expansion */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                        className="mt-3 pl-10"
                    >
                        <div className="text-sm space-y-2">
                            {/* Budget Progress Bar */}
                            <ProgressBar
                                spent={category.spent}
                                allocated={category.allocated}
                            />

                            {/* Detailed Amounts & Edit Button */}
                            <div className="flex justify-between items-center text-gray-600 pt-1">
                                <span className="text-xs">
                                    Allocated: {formatAmount(category.allocated)}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`font-semibold text-xs ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}
                                    >
                                        {isOverBudget ? 'OVER' : 'REMAINING'}: {formatAmount(Math.abs(remaining))}
                                    </span>
                                    {isEditing && (
                                        // Edit button appears when in editing mode
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent closing the accordion
                                                handleEditAllocation(category.categoryName);
                                            }}
                                            className="text-primary hover:text-primary/80 transition-colors"
                                            title="Edit Allocation"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Header Sub-Component for Actions ---
const HeaderActions: React.FC<{
    isEditing: boolean;
    onToggleEdit: () => void;
    onAddCategory: () => void;
}> = ({ isEditing, onToggleEdit, onAddCategory }) => {


    return (
        <div className="flex justify-between items-center w-full p-4 bg-primary text-primary-foreground">
            <h2 className="text-lg font-medium">Category Breakdown</h2>

            <div className="flex space-x-3">
                {/* TODO: Add Category Button */}

                {/* Edit Breakdown / Done Button */}
                <button
                    onClick={onToggleEdit}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    title={isEditing ? 'Done Editing' : 'Edit Breakdown'}
                >
                    {isEditing ? <X size={20} /> : <Pencil size={20} />}
                </button>
            </div>
        </div>
    );
};

interface IProps {
    data: CategoryBudget[]
}
// --- Main Component ---
const CategoriesSpentCard = ({ data }: IProps) => {
    // State to manage the editing mode
    const [isEditing, setIsEditing] = React.useState(false);

    // Placeholder function for "Add Category"
    const handleAddCategory = () => {
        alert('TODO: Implement modal/form for adding a new category.');
    };

    // Placeholder function for "Edit Breakdown" (Toggling mode)
    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <motion.div
            className="w-full max-w-md mx-auto shadow-sm rounded-2xl overflow-hidden bg-white border"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        >
            {/* Action Header */}
            <HeaderActions
                isEditing={isEditing}
                onToggleEdit={handleToggleEdit}
                onAddCategory={handleAddCategory}
            />

            {/* --- Category List --- */}
            <motion.div
                className="divide-y divide-gray-100"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {data.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        isEditing={isEditing}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default CategoriesSpentCard;