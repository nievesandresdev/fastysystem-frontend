// src/frontend/api/product.service.ts
import { post, get, del } from "./http";
const path = "/product";

//type
//
//
export interface productData {
  codigo: string;
  name: string;
  description: string;
  priceCExchange: number;    
  markup:number;    
  priceRExchange: number;    
  priceCLocal: number;    
  priceRLocal: number;    
  typeStockId: number;    // FK a measurement_units
  stock: number;
  minStock: number;
}

export interface Product extends ProductData {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithUnit extends Product {
  unitName: string;
  unitAbbreviation: string;
}

export interface MeasurementUnit {
  id: number;
  name: string;
  abbreviation: string;
}

export interface ProductListFilters {
  perPage: number;
  onlyActive?: boolean;
  lowStock?: boolean;
  latest?: boolean;
  search?: string | null;
}

//metodos
//
//
export function saveProductApi(data: ProductData) {
  return post<Product>(path, data);
}

export function getAllProductsApi(filters: ProductListFilters) {
  return get<ProductWithUnit[]>(path, filters);
}

export function getMeasurementUnitsApi() {
  return get<MeasurementUnit[]>(path + "/getMeasurementUnits");
}

export function deleteProductApi(id: number) {
  return del<Product>(`${path}/delete/${id}`);
}


