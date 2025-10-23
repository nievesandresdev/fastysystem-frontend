// src/frontend/api/expense.service.ts
import { post, get, del, put } from "./http";
const path = "/expense";

//type
//
//
export type ExpenseData = {
  concept: string;
  amount: string;
  type: string; // fixed, temporary
  status: string; // with-effect, without-effect
  editable: boolean; // true para fixed, false para temporary
  startDate: string;
  endDate: string; // vacío cuando tipo es "fixed"
  description: string;
}

export type Expense = ExpenseData & {
  id: number;
  created_at: string;
  updated_at: string;
}

export type ExpenseListResponse = {
    ok: boolean;
    status: number;
    code: string;
    message: string;
    data: Expense[];
}

export type ExpenseListFilters = {
  startDate?: string;
  endDate?: string;
}

//metodos
//
//
export function saveExpenseApi(data: ExpenseData) {
  return post<Expense>(path, data);
}

export function getAllExpensesApi(filters: ExpenseListFilters) {
  return get<ExpenseListResponse>(path, filters);
}

export function deleteExpenseApi(id: number) {
    return del(`${path}/${id}`);
}

export function toggleExpenseStatusApi(id: number) {
    return put(`${path}/${id}/toggle-status`);
}

export function updateExpenseApi(id: number, data: any) {
    return put(`${path}/${id}`, data);
}

export function completeExpenseApi(id: number, completionDate: string) {
    return put(`${path}/${id}/complete`, { completionDate });
}

export function getAllExpensesWithEffectApi(filters: ExpenseListFilters) {
    return get<ExpenseListResponse>(`${path}/with-effect`, filters);
}


