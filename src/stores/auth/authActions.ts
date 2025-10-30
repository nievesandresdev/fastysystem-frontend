// src/stores/auth/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, type LoginData } from '@/api/auth.service';

export type User = { id: string; username: string; email: string; roles: string[] }; // ajusta a tu modelo

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
        await window.authVault!.setToken(token);
        
        // Obtener roles del usuario desde la respuesta del login
        const roleNames = user.roles?.map((role: { id: number; name: string }) => role.name) || [];
        await window.authVault!.setUserRoles(roleNames);
        
        // Guardar información del usuario
        const userInfo = { 
          id: user.id.toString(), 
          name: user.name,
          username: user.username, 
          email: user.email, 
          roles: roleNames 
        };
        await window.authVault!.setUser(userInfo);
        
        return { 
          user: userInfo, 
          token 
        };
      } catch (e) {
        console.log('authVault setToken failed:', e);
        return rejectWithValue('No se pudo guardar el token');
      }
    } catch (err: any) {
      console.log('login thunk error:', err);
      return rejectWithValue(err?.data?.message ?? err?.message ?? 'Error de autenticación');
    }

  }
);
