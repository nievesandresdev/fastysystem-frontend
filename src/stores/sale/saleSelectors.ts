// stores/sale/saleSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";

export const saleItems = (state: RootState) => state.sale.items;

export const totalLocal = createSelector(
  [saleItems],
  (items) =>
    items
      .reduce((acc, item) => acc + item.qty * parseFloat(item.priceLocal), 0)
      .toFixed(2)
);

export const totalExchange = createSelector(
  [saleItems],
  (items) =>
    items
      .reduce((acc, item) => acc + item.qty * parseFloat(item.priceExchange), 0)
      .toFixed(2)
);
