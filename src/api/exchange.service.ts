// src/frontend/api/exchange.service.ts
import { get, post } from "./http";

export interface Coin {
  id: number;
  name: string;
  abbreviation: string;   
  symbol: string;
}

export interface ExchangeData {
  id: number;
  active:boolean;   
  exchange:number;   
  coinId:number; 
  created_at: string;
  updated_at: string;
}

// export interface ExchangeWithCoin extends Exchange {
//   coinName: string;     
//   coinAbbreviation: string;
//   coinSymbl: string;
// }

const path = "/exchange";

export function getCoinsApi() {
  return get<Coin[]>(path+"/getCoins");
}

export function createApi( data: { exchange: number, coinId: number } ) {
  return post<ExchangeData>(path+"/create", data); 
}

export function findActiveApi() {
  return get<ExchangeData[]>(path+"/findActive");
}

