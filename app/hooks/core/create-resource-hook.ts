'use client'
import { QueryFilters } from "@/app/types";
import axios from "axios";
import { useMemo, useState } from "react";
import { useBaseMutation } from "./base-mutation";
import { useBaseQuery } from "./base-query";

interface CreateResourceHookOptions {
    resource: string;
    baseUrl: string;
    getUrl?: string;
    postUrl?: string;
    updateUrl?: string;
    deleteUrl?: string;
    filters?: QueryFilters;
    alwaysEnabled?: boolean;
}

export function createResourceHook<TData extends { id?: string }>({
    resource,
    baseUrl,
    filters: initialFilters = {},
    deleteUrl,
    getUrl,
    postUrl,
    updateUrl,
    alwaysEnabled
}: CreateResourceHookOptions) {
    return function useResource() {

        const [filters, setFilters] = useState(initialFilters);

        const queryKey = useMemo(() => [resource, filters], [filters]);

        const query = useBaseQuery<TData[]>(
            queryKey,
            async () => {
                const url = getUrl ? getUrl : baseUrl;
                console.log(url)
                const response = await axios.get(url, { params: filters, });
                return response.data;
            },
        );

        // Create mutation
        const createMutation = useBaseMutation<TData, Partial<TData>, TData>(
            async (data) => (await axios.post(baseUrl, data,)).data,
            {
                onSuccess: () => query.refetch(),
            }
        );

        // Update mutation
        const updateMutation = useBaseMutation<TData, TData>(
            async (data) => (await axios.put(`${baseUrl}/${data.id}`, data,)).data,
            {
                onSuccess: () => query.refetch(),
            }
        );

        // Delete mutation
        const deleteMutation = useBaseMutation<void, string>(
            async (id) => await axios.delete(`${baseUrl}/${id}`,),
            {
                onSuccess: () => query.refetch(),
            }
        );

        return {
            ...query,
            filters,
            setFilters,
            createMutation,
            updateMutation,
            deleteMutation,
            keys: [resource],
        };
    }
}