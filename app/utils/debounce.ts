import { useEffect, useState } from 'react';

/**
 * A custom hook to debounce a value.
 * The returned value will only update after the specified delay has passed
 * without any further changes to the input value.
 *
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
    // State to store the debounced value.
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer that will update the debounced value after the delay.
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function to clear the timeout if the value changes
        // or the component unmounts. This is crucial to prevent
        // the debounced value from updating prematurely.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run the effect if value or delay changes.

    return debouncedValue;
}
