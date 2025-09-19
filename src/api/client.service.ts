import { post, get } from "./http";

export interface ClientForm {
  id?: number | null; // si ya existe en BD
  document: string;
  phone: string | null;
  name: string;
  lastname: string | null;
}

const path = "/client";
 
export function getClientsByDocumentApi(search: string) {
  return get<ClientForm[]>(path+"/getClientsByDocument", {search});
}

export function saveClientApi( data: ClientForm ) {
  return post<ClientForm>(path+"/save", data); 
}

export function searchClientApi( search: string ) {
  return get<ClientForm[]>(path+"/searchClient", {search}); 
}
