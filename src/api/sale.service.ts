import { post } from "./http";

const path = "/sale";

type SaleState = {
  items: SaleItem[];
  clientId: number | null;
  loading: boolean;
  error: string | null;
};

export type SaleItem = {
  id: number;
  codigo: string;
  name: string;
  stock: number;
  priceRLocal: number;
  priceRExchange: number;
  qty: number;
};

export interface SaveSaleRequest {
  clientId: number | null;
  items: SaleItem[];
  payments: Record<string, { amount: string; reference?: string; concept?: string }>;
  change: Record<string, { amount: string; reference?: string; concept?: string }>;
  totalLocal: string;
  totalExchange: string;
}



export function saveSaleApi(data: SaveSaleRequest) {
  return post<SaveSaleRequest>(path+"/save", data);
}
