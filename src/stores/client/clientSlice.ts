// src/stores/client/clientSlice.ts
import { createSlice, PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import { findClientByDocument, saveClient } from "./clientActions";
import { type ClientForm } from '@/api/client.service.ts';

type ClientState = {
  data: ClientForm;      
  original: ClientForm; 
  loading: boolean;
  error: string | null;
};

const initialForm: ClientForm = {
  id: null,
  document: "",
  phone: null,
  name: null,
  lastname: null,
};

const initialState: ClientState = {
  data: initialForm,
  original: initialForm,
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ name: string; value: string }>) => {
      const { name, value } = action.payload;
      (state.data as any)[name] = value;
    },
    resetClientForm: (state) => {
      state.data = initialForm;
      state.original = initialForm;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(findClientByDocument.pending, saveClient.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(findClientByDocument.fulfilled, saveClient.fulfilled),
        (state, action: PayloadAction<ClientForm>) => {
          state.loading = false;
          state.data = { ...action.payload };
          state.original = { ...action.payload }; // guardamos snapshot
        }
      )
      .addMatcher(
        isAnyOf(findClientByDocument.rejected, saveClient.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload ?? "Error desconocido";
        }
      );
  },
});

export const { updateField, resetClientForm } = clientSlice.actions;
export default clientSlice.reducer;
