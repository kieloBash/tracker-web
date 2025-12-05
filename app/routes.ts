const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'; // Added a fallback URL

export enum ROUTE_NAMES {
    LOGIN = "login",
    ADD_CALCULATIONS = "addCalculations"
}

export type HttpMethod = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

type Route = {
    url: string;
    method: HttpMethod;
}

const ROUTES: Record<ROUTE_NAMES, Route> = {
    [ROUTE_NAMES.LOGIN]: { // Use bracket notation for cleaner access to enum keys
        url: `${API_URL}/login`, // Using template literals is often cleaner
        method: "POST"
    },
    [ROUTE_NAMES.ADD_CALCULATIONS]: {
        url: `${API_URL}/add-calculations`,
        method: "POST"
    },

};

export default ROUTES;