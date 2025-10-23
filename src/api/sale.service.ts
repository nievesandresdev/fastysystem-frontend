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
  items: SaleItem[];
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

export function saveSaleApi(data: SaveSaleRequest) {
  return post<SaveSaleRequest>(path+"/save", data);
}

export function getSalesStatsApi(filters: SalesStatsFilters) {
  return get<SalesStatsResponse>(path+"/stats", filters);
}
