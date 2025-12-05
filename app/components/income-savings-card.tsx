"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Briefcase, Check, Edit, Save } from 'lucide-react'
import { useState } from 'react'
import { formatAmount } from '../utils'

// Mock Data / State Management
interface IncomeSavingsData {
    monthlyIncome: number;
    savingsGoal: number;
}

interface IProps {
    monthlyIncome: number;
    savingsGoal: number;
    handleUpdateIncomeSavings: (monthlyIncome: number, savingsGoal: number) => void
}

const IncomeSavingsCard = ({
    monthlyIncome,
    savingsGoal,
    handleUpdateIncomeSavings
}: IProps) => {
    const [data, setData] = useState<IncomeSavingsData>({
        monthlyIncome,
        savingsGoal,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempIncome, setTempIncome] = useState(data.monthlyIncome.toString());
    const [tempSavingsGoal, setTempSavingsGoal] = useState(data.savingsGoal.toString());

    const handleSave = () => {
        const newIncome = parseFloat(tempIncome) || 0;
        const newGoal = parseFloat(tempSavingsGoal) || 0;

        if (newGoal > newIncome) {
            alert("Savings goal cannot exceed monthly income.");
            return;
        }

        handleUpdateIncomeSavings(newIncome, newGoal)
        setData({
            monthlyIncome: newIncome,
            savingsGoal: newGoal,
        });
        setIsEditing(false);
    };

    /**
     * Compact Reusable component for displaying/editing a single metric.
     */
    const MetricDisplay = ({ label, icon: Icon, value, tempValue, setTempValue, showEdit }: {
        label: string,
        icon: React.ElementType,
        value: number,
        tempValue: string,
        setTempValue: (v: string) => void,
        showEdit: boolean,
    }) => (
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className={`flex-1 p-2 rounded-lg border shadow-sm min-w-[48%] bg-card flex flex-col justify-between`}
        >
            <div className="flex justify-between items-center mb-1">
                <p className={`text-xs font-medium flex items-center gap-1`}>
                    <Icon className="w-3 h-3" /> {label}
                </p>
                {showEdit && (
                    <Button
                        variant="ghost"
                        size="sm" // Extra small button size
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={`h-6 w-6 p-0 text-gray-500`}
                    >
                        {isEditing ? <Check className="w-3 h-3" /> : <Edit className="w-3 h-3" />}
                    </Button>
                )}
            </div>
            {isEditing ? (
                <Input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className={`h-7 px-1 text-xl font-mono`}
                />
            ) : (
                <motion.h2
                    key={`${label}-${value}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-2xl font-bold`}
                >
                    {formatAmount(value)}
                </motion.h2>
            )}
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full grid grid-cols-2 gap-2"
        >
            <MetricDisplay
                label="Monthly Income"
                icon={Briefcase}
                value={data.monthlyIncome}
                tempValue={tempIncome}
                setTempValue={setTempIncome}
                showEdit={true} // Edit button placed here
            />
            <MetricDisplay
                label="Savings Goal"
                icon={Save}
                value={data.savingsGoal}
                tempValue={tempSavingsGoal}
                setTempValue={setTempSavingsGoal}
                showEdit={false}
            />
        </motion.div>
    )
}

export default IncomeSavingsCard