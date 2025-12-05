import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useBaseQuery<TData>(
    key: QueryKey,
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, any, TData, QueryKey>, 'queryKey' | 'queryFn'>,
) {
    return useQuery<TData>({
        queryKey: key,
        queryFn,
        ...options,
    });
}