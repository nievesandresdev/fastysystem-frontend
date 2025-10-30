// http.ts
import axios, { AxiosRequestConfig, Method, AxiosError } from 'axios';
//***
//
//
// data
//
//
// */
const URL_BASE_BACKEND = import.meta.env.VITE_API_URL_GENERAL as string;

export const http = axios.create({
  baseURL: URL_BASE_BACKEND,
  timeout: 20000,
});

//***
//
//
// interceptors
//
//
// */
http.interceptors.request.use(async (config) => {
  const tokenFromVault = await window.authVault?.getToken?.();
  const token = tokenFromVault ?? null;
  
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }

  // Agregar roles del usuario en headers
  const userRoles = await window.authVault?.getUserRoles?.();
  if (userRoles && userRoles.length > 0) {
    config.headers = { ...config.headers, 'X-User-Roles': userRoles.join(',') };
  }

  return config;
});

// --- callback registrable desde la app ---
let onUnauthorized: VoidFunction | undefined;
let onPermissionDenied: ((message?: string) => void) | undefined;

export const setOnUnauthorized = (fn: VoidFunction) => { onUnauthorized = fn; };
export const setOnPermissionDenied = (fn: (message?: string) => void) => { onPermissionDenied = fn; };

http.interceptors.response.use(r => r, async (err) => {
  if (err?.response?.status === 401) {
    await window.authVault?.clear?.();
    onUnauthorized?.();               // navega al login
  } else if (err?.response?.status === 403) {
    // Manejar error de permisos
    const errorMessage = err?.response?.data?.error || 'No tienes permisos para realizar esta acción';
    onPermissionDenied?.(errorMessage);
  }
  return Promise.reject(err);
});

//***
//
//
// apiHttp
//
//
// */

export async function apiHttp<T = any>(
  method: Method,
  endpoint: string,
  data?: any,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const config: AxiosRequestConfig = { method, url: endpoint, ...options };

  // GET/DELETE usan params; POST/PUT usan data
  if (method === 'GET' || method === 'DELETE') {
    if (data) config.params = data;
  } else {
    config.data = data;
  }

  try {
    const res = await http.request<T>(config);
    return res.data as T;
  } catch (err) {
    // console.log('http error',err)
    if (axios.isAxiosError(err)) {
      throw err.response; // NO perder response.data
    }
    throw err as Error;
  }
}

//***
//
//
// helpers
//
//
// */
export const get  = <T=any>(endpoint: string, params?: any, options?: AxiosRequestConfig) =>
  apiHttp<T>('GET', endpoint, params, options);
export const del  = <T=any>(endpoint: string, params?: any, options?: AxiosRequestConfig) =>
  apiHttp<T>('DELETE', endpoint, params, options);
export const post = <T=any>(endpoint: string, body?: any, options?: AxiosRequestConfig) =>
  apiHttp<T>('POST', endpoint, body, options);
export const put  = <T=any>(endpoint: string, body?: any, options?: AxiosRequestConfig) =>
  apiHttp<T>('PUT', endpoint, body, options);
export const patch = <T=any>(endpoint: string, body?: any, options?: AxiosRequestConfig) =>
  apiHttp<T>('PATCH', endpoint, body, options);
