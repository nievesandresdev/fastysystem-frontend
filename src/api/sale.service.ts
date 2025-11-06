import { post, get } from "./http";

const path = "/sale";

export type SaleItem = {
  id: number;
  codigo: string;
  name: string;
  stock: number;
  priceLocal: number;
  priceExchange: number;
  priceCExchange: number;
  qty: number;
  unitAbbreviation?: string;
};

export interface SaveSaleRequest {
  clientId: number | null;
  exchangeId: number;
  itemslist: SaleItem[];
  payments: Record<string, { amount: string; reference?: string; concept?: string }>;
  change: Record<string, { amount: string; reference?: string; concept?: string }>;
  totalLocal: string;
  totalExchange: string;
}



export interface SalesStatsResponse {
  ok: boolean;
  status: number;
  code: string;
  message: string;
  data: {
    sales: Sale[];
    summary: {
      totalSalesLocal: string;
      totalSalesExchange: string;
      totalProfitLocal: string;
      totalProfitExchange: string;
      salesCount: number;
    };
  };
}

export interface Sale {
  id: number;
  userId: number;
  clientId: number | null;
  exchangeId: number;
  totalLocal: string;
  totalExchange: string;
  totalProfitLocal: string;
  totalProfitExchange: string;
  created_at: string;
  updated_at: string;
}

export interface SalesStatsFilters {
  startDate: string;
  endDate: string;
}

export interface MonthlyReportData {
  month: string;
  totalProducts: number;
  totalProfit: number;
  totalExpenses: number;
}

export interface MonthlyReportResponse {
  ok: boolean;
  status: number;
  code: string;
  message: string;
  data: MonthlyReportData[];
}

export function saveSaleApi(data: SaveSaleRequest) {
  return post<SaveSaleRequest>(path+"/save", data);
}

export function getSalesStatsApi(filters: SalesStatsFilters) {
  return get<SalesStatsResponse>(path+"/stats", filters);
}

export function getMonthlyReportApi(filters: SalesStatsFilters) {
  return get<MonthlyReportResponse>(path+"/monthly-report", filters);
}

export interface CurrentPeriodStatsResponse {
  ok: boolean;
  status: number;
  code: string;
  message: string;
  data: {
    startDate: string;
    endDate: string;
    transactionCount: number;
    totalLocal: number;
    totalExchange: number;
  };
}

export function getCurrentPeriodStatsApi() {
  return get<CurrentPeriodStatsResponse>(path+"/current-period");
}

export interface TopProduct {
  id: number;
  name: string;
  codigo: string;
  totalSold: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  codigo: string;
  stock: number;
  minStock: number;
}

export interface TopProductsAndLowStockResponse {
  ok: boolean;
  status: number;
  code: string;
  message: string;
  data: {
    topProducts: TopProduct[];
    lowStockProducts: LowStockProduct[];
  };
}

export function getTopProductsAndLowStockApi() {
  return get<TopProductsAndLowStockResponse>(path+"/top-products-low-stock");
}
