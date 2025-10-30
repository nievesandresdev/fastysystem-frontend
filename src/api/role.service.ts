// src/frontend/api/role.service.ts
import { get } from "./http";
const path = "/role";

//types
export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface RolesResponse {
  ok: boolean;
  status: number;
  code: string;
  message: string;
  data: Role[];
}

//methods
export function getAllRolesApi() {
  return get<RolesResponse>(path);
}
