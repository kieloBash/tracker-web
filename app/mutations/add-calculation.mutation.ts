import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import ROUTES, { ROUTE_NAMES } from "../routes";
import { AddCalculationsPayload } from "../types";

const ROUTE = ROUTES[ROUTE_NAMES.ADD_CALCULATIONS];
const queryKey: string[] = []

const mutationFn = async (payload: AddCalculationsPayload) => {
    const response = await axios.post(ROUTE.url, payload);
    return response.data;
};

export const useAddCalculationsMutation = ({ onSuccess }: {
    onSuccess: (d: any) => void
}) => {
    const queryClient = useQueryClient();

    return useMutation<
        any, // TData: The data returned by the API
        Error, // TError: The error type
        AddCalculationsPayload // TVariables: The payload passed to the mutate function
    >({
        mutationFn,

        onSuccess: (newTransaction) => {
            onSuccess(newTransaction);
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (error, variables) => {
            console.error(`Failed to add transaction for ${variables.type}:`, error.message);
        },
    });
}