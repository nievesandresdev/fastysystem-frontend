
// src/stores/exchange/exchangeSlice.ts
import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { saveExchange, findActive } from './exchangeActions';
import { type ExchangeWithCoin } from '@/api/exchange.service';

type ExchangeState = {
  current: ExchangeWithCoin | null;   // tasa actual
  loading: boolean;
  error: string | null;
  isExchangeSettingOpen: boolean;     // controla si el modal está abierto
};

const initialState: ExchangeState = {
  current: null,
  loading: false,
  error: null,
  isExchangeSettingOpen: false,
};

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    clearExchange(state) {
      state.current = null;
      state.error = null;
    },
    setIsExchangeSettingOpen(state, action: PayloadAction<boolean>) {
      state.isExchangeSettingOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(saveExchange.pending, findActive.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(saveExchange.fulfilled, findActive.fulfilled),
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.current = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(saveExchange.rejected, findActive.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload ?? 'Error desconocido';
        }
      );
  },
});

export const { clearExchange, setIsExchangeSettingOpen } = exchangeSlice.actions;
export default exchangeSlice.reducer;
