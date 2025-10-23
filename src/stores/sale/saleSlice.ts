import { createSlice, PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import { saveSale } from "./saleActions";
import { type SaleItem, type SaleState } from "@/api/sale.service.ts";

const initialState: SaleState = {
  items: [],
  clientId: null,
  loading: false,
  error: null,
};

const saleSlice = createSlice({
  name: "sale",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<SaleItem>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty; // acumula cantidad
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQty: (state, action: PayloadAction<{ id: number; qty: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.qty = action.payload.qty;
    },
    clearSale: (state) => {
      state.items = [];
      state.clientId = null;
    },
    setClient: (state, action: PayloadAction<number | null>) => {
      state.clientId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(saveSale.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isAnyOf(saveSale.fulfilled), (state) => {
        state.loading = false;
        state.items = []; // limpia carrito al guardar
        state.clientId = null;
      })
      .addMatcher(isAnyOf(saveSale.rejected), (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al guardar venta";
      });
  },
});

export const { addItem, removeItem, updateQty, clearSale, setClient } = saleSlice.actions;
export default saleSlice.reducer;
