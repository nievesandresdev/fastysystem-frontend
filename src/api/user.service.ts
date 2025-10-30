// src/frontend/api/user.service.ts
import { post, get, put } from "./http";
const path = "/user";

//types
export interface User {
  id: number;
  name: string;
  lastname: string | null;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles?: string[];
}

export interface CreateUserData {
  name: string;
  lastname?: string;
  username: string;
  email?: string;
  password: string;
  confirmPassword?: string;
  roles: string[];
}

export interface UpdateUserData {
  name: string;
  lastname?: string;
  username: string;
  email?: string;
  roles: string[];
}

export interface UserResponse {
  ok: boolean;
  status: number;
  code: string;
  message: string;
  data: User;
}

export interface UsersListResponse {
  ok: boolean;
  status: number;
  code: string;
  message: string;
  data: User[];
}

//methods
export function createUserApi(data: CreateUserData) {
  return post<UserResponse>(path, data);
}

export function getAllUsersApi() {
  return get<UsersListResponse>(path);
}

export function updateUserApi(id: number, data: UpdateUserData) {
  return put<UserResponse>(`${path}/${id}`, data);
}
