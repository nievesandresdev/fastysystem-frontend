// src/stores/auth/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { loginApi, type LoginData } from '@/api/auth.service';

export type User = { id: string; username: string; email: string }; // ajusta a tu modelo

export const loginUser = createAsyncThunk<
  { user: User; token: string },               // retorno (payload de fulfilled)
  LoginData,          // argumento
  { rejectValue: string } // payload de rejected
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginApi(credentials);
      const { user, token } = res.data;
      
      try {
        const prev = await window.authVault!.getToken();
        await window.authVault!.setToken(token);
      } catch (e) {
        console.log('authVault setToken failed:', e);
        return rejectWithValue('No se pudo guardar el token');
      }

      return { user, token };
    } catch (err: any) {
      console.log('login thunk error:', err);
      return rejectWithValue(err?.data?.message ?? err?.message ?? 'Error de autenticación');
    }

  }
);
