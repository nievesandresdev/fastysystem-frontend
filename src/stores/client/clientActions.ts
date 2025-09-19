// src/stores/client/clientThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { ClientForm } from "./clientSlice";
import { getClientsByDocumentApi, saveClientApi, type ClientForm } from '@/api/client.service.ts';

export const findClientByDocument = createAsyncThunk<
  ClientForm,
  { document: string },
  { rejectValue: string }
>("client/findByDocument", async ({ document }, { rejectWithValue }) => {
  try {
    const res = await getClientsByDocumentApi(document);
    return res.data as ClientForm;
  } catch (err: any) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message ?? axiosErr.message ?? "Cliente no encontrado"
    );
  }
});

export const saveClient = createAsyncThunk<
  ClientForm,
  ClientForm,
  { rejectValue: string }
>("client/save", async (data, { rejectWithValue }) => {
  try {
    const res = await saveClientApi(data);
    return res.data as ClientForm;
  } catch (err: any) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message ?? axiosErr.message ?? "Error al guardar cliente"
    );
  }
});
