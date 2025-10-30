import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, type User } from './authActions';
type AuthState = { user: User|null; token: string|null; loading: boolean; error: string|null }
const initialState: AuthState = { user: null, token: null, loading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ username: string; name: string }>) {
      state.user = action.payload;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    loadUser(state, action: PayloadAction<{ user: User; token: string } | null>) {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
      } else {
        state.user = null;
        state.token = null;
      }
      state.loading = false;
      state.error = null;
    },
    logout(state){ 
      state.user=null; state.token=null; state.error=null; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,(state) => { 
        state.loading = true; state.error = null; 
      })
      .addCase(loginUser.fulfilled, (s, a: PayloadAction<{ user: User; token: string }>) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
      })
      .addCase(loginUser.rejected,  (state, action) => {
        state.loading = false; state.error = (action.payload as string) ?? 'Error de login';
      });
  },
});

export const { setUser, setError, setLoading, loadUser, logout } = authSlice.actions;
export default authSlice.reducer;
