// src/stores/exchange/exchangeThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, findActiveApi, type ExchangeData } from '@/api/exchange.service.ts';
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
      return res.data as Exchange;
    } catch (err: any) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message ?? axiosErr.message ?? 'Error al guardar la tasa'
      );
    }
  }
);

export const findActive = createAsyncThunk<
  ExchangeData,
  [],
  { rejectValue: string }
>(
  'exchange/findActive',
  async (data, { rejectWithValue }) => {
    try {
      const res = await findActiveApi();
      return res.data as Exchange;
    } catch (err: any) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message ?? axiosErr.message ?? 'Error al encontrar la tasa'
      );
    }
  }
);
