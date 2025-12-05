"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { CalendarIcon, DollarSignIcon, Settings2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { PaymentMethod, PaymentMethodList, TransactionCategory, TransactionCategoryList } from "../constants/transactions";
// Import Framer Motion components

// ... (TransactionFilters and initialFilters remain the same) ...

interface TransactionFilters {
    searchText: string;
    categories: TransactionCategory[];
    paymentMethods: PaymentMethod[];
    amountMin: number | '';
    amountMax: number | '';
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
}

const initialFilters: TransactionFilters = {
    searchText: "",
    categories: [],
    paymentMethods: [],
    amountMin: "",
    amountMax: "",
    dateFrom: subDays(new Date(), 30), // Default to last 30 days
    dateTo: new Date(),
};

interface IProps { }

const TransactionFilterSection = ({ }: IProps) => {
    const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // --- Filter Handler Functions ---

    // Handles adding/removing items from the Category or PaymentMethod array
    const handleArrayFilterChange = (
        key: 'categories' | 'paymentMethods',
        item: TransactionCategory | PaymentMethod
    ) => {
        setFilters(prev => {
            const currentArray: any[] = prev[key];
            if (currentArray.includes(item as any)) {
                // Remove item
                return { ...prev, [key]: currentArray.filter(i => i !== item) };
            } else {
                // Add item
                return { ...prev, [key]: [...currentArray, item] };
            }
        });
    };

    // Handles changes to numerical inputs (Amount)
    const handleAmountChange = (key: 'amountMin' | 'amountMax', value: string) => {
        const parsedValue = value === '' ? '' : Number(value);
        if (value === '' || (!isNaN(parsedValue as number) && (parsedValue as number) >= 0)) {
            setFilters(prev => ({ ...prev, [key]: parsedValue }));
        }
    };

    // Resets all filters to their initial state
    const handleClearFilters = () => {
        setFilters(initialFilters);
    };

    // Placeholder for applying the filters (e.g., fetching data)
    const handleApplyFilters = () => {
        console.log("Applying Filters:", filters);
        // Implement your data fetching/filtering logic here
        setIsPopoverOpen(false); // Close popover after applying
    };

    // Counts how many advanced filters are active (excluding the main search)
    const activeFilterCount = (
        (filters.categories.length > 0 ? 1 : 0) +
        (filters.paymentMethods.length > 0 ? 1 : 0) +
        ((filters.amountMin as number) > 0 || (filters.amountMax as number) > 0 ? 1 : 0) + // Check if amount is actually set
        (filters.dateFrom && filters.dateTo ? 1 : 0)
    );

    return (
        <section className="w-full sticky top-0 z-[20] h-12 bg-background border-b flex items-center">
            <div className="w-full flex justify-center items-center">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn("transition-colors flex-shrink-0", { "text-primary hover:text-primary": activeFilterCount > 0 })}
                        >
                            <Settings2Icon className="mr-2 h-4 w-4" />
                            Advanced Filters
                            {activeFilterCount > 0 && (
                                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-sm p-4 space-y-4" align="center">
                        {/* ... (Filter Content remains the same) ... */}
                        <h4 className="font-medium text-lg">Filter Options</h4>
                        <Separator />

                        {/* --- Filter: Date Range --- */}
                        <div>
                            <Label className="mb-2 block font-semibold text-sm">🗓️ Date Range</Label>
                            <div className="flex space-x-2">
                                {/* DatePicker for From Date */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[150px] justify-start text-left font-normal",
                                                !filters.dateFrom && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.dateFrom ? format(filters.dateFrom, "MMM dd, yyyy") : <span>Start Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateFrom}
                                            onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <span className="flex items-center">to</span>

                                {/* DatePicker for To Date */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[150px] justify-start text-left font-normal",
                                                !filters.dateTo && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.dateTo ? format(filters.dateTo, "MMM dd, yyyy") : <span>End Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateTo}
                                            onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                                            initialFocus
                                            // Ensure 'to' date is not before 'from' date
                                            disabled={(date) => filters.dateFrom ? date < filters.dateFrom : false}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <Separator />

                        {/* --- Filter: Amount Range --- */}
                        <div>
                            <Label className="mb-2 block font-semibold text-sm">💰 Amount Range</Label>
                            <div className="flex space-x-2 items-center">
                                <div className="relative w-1/2">
                                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        min="0"
                                        className="pl-8"
                                        value={filters.amountMin}
                                        onChange={(e) => handleAmountChange('amountMin', e.target.value)}
                                    />
                                </div>
                                <span className="text-muted-foreground">to</span>
                                <div className="relative w-1/2">
                                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        min="0"
                                        className="pl-8"
                                        value={filters.amountMax}
                                        onChange={(e) => handleAmountChange('amountMax', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <Separator />

                        {/* --- Filter: Category (Multi-Select Checkboxes) --- */}
                        <div>
                            <Label className="mb-2 block font-semibold text-sm">🏷️ Category</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                                {TransactionCategoryList.map((category) => (
                                    <div key={category} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`cat-${category}`}
                                            checked={filters.categories.includes(category as TransactionCategory)}
                                            onCheckedChange={() => handleArrayFilterChange('categories', category as TransactionCategory)}
                                        />
                                        <label
                                            htmlFor={`cat-${category}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />

                        {/* --- Filter: Payment Method (Multi-Select Checkboxes) --- */}
                        <div>
                            <Label className="mb-2 block font-semibold text-sm">💳 Payment Method</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2">
                                {PaymentMethodList.map((method) => (
                                    <div key={method} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`pm-${method}`}
                                            checked={filters.paymentMethods.includes(method as PaymentMethod)}
                                            onCheckedChange={() => handleArrayFilterChange('paymentMethods', method as PaymentMethod)}
                                        />
                                        <label
                                            htmlFor={`pm-${method}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                                        >
                                            {method}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* --- Action Buttons --- */}
                        <div className="flex justify-between pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                disabled={activeFilterCount === 0 && filters.searchText === initialFilters.searchText}
                            >
                                <XIcon className="mr-2 h-4 w-4" />
                                Clear Filters
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleApplyFilters}
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </section>
    );
};

export default TransactionFilterSection;