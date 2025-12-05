
export interface QueryFilters {
    page?: number;
    limit?: number;
    createdAtOrderBy?: "asc" | "desc";
    search?: string;
    [key: string]: any;
}