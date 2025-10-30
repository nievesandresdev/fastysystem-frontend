// src/stores/exchange/exchangeThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, findActiveApi, type ExchangeData, type ExchangeWithCoin } from '@/api/exchange.service.ts';
import type { AxiosError } from 'axios';


export const saveExchange = createAsyncThunk<
  ExchangeData,                   // payload al cumplir
  { coinId: number; exchange: number }, // argumento
  { rejectValue: string }     // payload en rejected
>(
  'exchange/saveExchange',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createApi(data);
      return res.data as ExchangeData;
    } catch (err: any) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.data?.data?.error ?? 'Error al guardar la tasa'
      );
    }
  }
);

export const findActive = createAsyncThunk<
  ExchangeWithCoin,
  void,
  { rejectValue: string }
>(
  'exchange/findActive',
  async (_, { rejectWithValue }) => {
    try {
      const res = await findActiveApi();
      return res.data as ExchangeWithCoin;
    } catch (err: any) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message ?? axiosErr.message ?? 'Error al encontrar la tasa'
      );
    }
  }
);
