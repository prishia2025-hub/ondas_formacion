import { fetchApi, type PaginatedResponse } from './base';

export interface Lead {
  id_lead: number;
  nombre: string;
  telefono?: string;
  mail?: string;
  trabajador: boolean;
  // Relational data might be included depending on the endpoint
  estado?: string;
  //origen?: string;
  fecha_creacion?: string;
  ultimo_contacto?: string;
  courses_count?: number;
}

export type LeadFormData = Omit<Lead, 'id_lead' | 'estado' | 'ultimo_contacto'> & {
  estado?: string;
  nota_inicial?: string;
};

export async function fetchLeads(params?: { 
  page?: number; 
  limit?: number; 
  search?: string; 
  estado?: string; 
  trabajador?: string;
  origen?: string;
  sort_by?: 'nombre' | 'fecha_creacion';   
  sort_dir?: 'asc' | 'desc';   
 }): Promise<PaginatedResponse<Lead>> {

  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.estado) queryParams.append('estado', params.estado);
  if (params?.origen) queryParams.append('origen', params.origen);
  if (params?.trabajador) queryParams.append('trabajador', params.trabajador);
  if (params?.sort_by)   queryParams.append('sort_by', params.sort_by);   
  if (params?.sort_dir)  queryParams.append('sort_dir', params.sort_dir); 

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/leads?${queryString}` : '/api/leads';

  return fetchApi<PaginatedResponse<Lead>>(endpoint);
}

export async function fetchLead(id: number): Promise<Lead> {
  return fetchApi<Lead>(`/api/leads/${id}`);
}

export async function createLead(data: LeadFormData): Promise<Lead> {
  return fetchApi<Lead>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLead(id: number, data: Partial<LeadFormData>): Promise<Lead> {
  return fetchApi<Lead>(`/api/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLead(id: number): Promise<void> {
  return fetchApi<void>(`/api/leads/${id}`, {
    method: 'DELETE',
  });
}
