
// src/stores/exchange/exchangeSlice.ts
import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { saveExchange, findActive, type Exchange } from './exchangeActions';

type ExchangeState = {
  current: Exchange | null;   // tasa actual
  loading: boolean;
  error: string | null;
};

const initialState: ExchangeState = {
  current: null,
  loading: false,
  error: null,
};

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    clearExchange(state) {
      state.current = null;
      state.error = null;
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
        (state, action: PayloadAction<ExchangeData>) => {
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

export const { clearExchange } = exchangeSlice.actions;
export default exchangeSlice.reducer;
