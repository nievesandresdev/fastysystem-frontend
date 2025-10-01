// packages/frontend/src/stores/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import exchangeReducer from './exchange/exchangeSlice';
import clientReducer from './client/clientSlice';
import saleReducer from './sale/saleSlice';

export const store = configureStore({ 
    reducer: {
        auth: authReducer,
        exchange: exchangeReducer,
        client: clientReducer,
        sale: saleReducer
    } 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
