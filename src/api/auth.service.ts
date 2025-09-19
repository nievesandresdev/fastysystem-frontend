// src/frontend/api/auth.service.ts
import { post } from "./http";

export interface LoginData {
  username: string;
  password: string;
}
export interface AuthResponse {
  ok: boolean;
  token: string;
  user: { id: number; username: string; email: string };
}

const path = "/auth";

export function loginApi(data: LoginData) {
  // apunta a /auth/login en tu backend (API_GENERAL por defecto)
  return post<AuthResponse>(path+"/login", data);
}

export function registerApi(dto: { username: string; email: string; password: string }) {
  return post<AuthResponse>(path+"/register", dto);
}
