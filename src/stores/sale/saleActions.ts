import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { saveSaleApi, type SaveSaleRequest, type SaveSaleResponse } from "@/api/sale.service";

export const saveSale = createAsyncThunk<
  SaveSaleResponse,
  SaveSaleRequest,
  { rejectValue: string }
>("sale/saveSale", async (data, { rejectWithValue }) => {
  try {
    console.log('data',data);
    const res = await saveSaleApi(data);
    return res.data;
  } catch (err: any) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message ?? axiosErr.message ?? "Error al guardar venta"
    );
  }
});
