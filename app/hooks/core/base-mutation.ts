import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useBaseMutation<TData, TVariables, TOutput = TData>(
    mutationFn: (variables: TVariables) => Promise<TOutput>,
    options?: UseMutationOptions<TOutput, Error, TVariables>
) {
    return useMutation<TOutput, Error, TVariables>({
        mutationFn,
        ...options,
    });
}