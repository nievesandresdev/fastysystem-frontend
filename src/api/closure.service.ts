import { post, get } from "./http";

const path = "/closure";

export interface PaymentMethodBreakdown {
    debit: number;
    cash: number;
    exchange: number;
    transfer: number;
    other: number;
}

export interface PaymentBreakdown {
    payments: PaymentMethodBreakdown; // Desglose de pagos recibidos (sale_payments)
    changes: PaymentMethodBreakdown; // Desglose de cambios devueltos (sale_changes)
    extraBalance: number;
}

export interface Closure {
    id: number;
    totalLocal: string;
    totalExchange: string;
    totalProductsSold: number;
    openAt: string;
    closedAt: string;
    paymentBreakdown: PaymentBreakdown;
    created_at: string;
    updated_at: string;
}

export interface CreateClosureResponse {
    ok: boolean;
    status: number;
    code: string;
    message: string;
    data: {
        closure: Closure;
        salesCount: number;
    };
}

export interface ClosureListFilters {
    startDate?: string;
    endDate?: string;
    page: number;
    perPage: number;
}

export interface ClosureListResponse {
    ok: boolean;
    status: number;
    code: string;
    message: string;
    data: {
        data: Closure[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

export function createClosureApi() {
    return post<CreateClosureResponse>(path + "/create");
}

export function getAllClosuresApi(filters: ClosureListFilters) {
    return get<ClosureListResponse>(path + "/getAll", filters);
}

