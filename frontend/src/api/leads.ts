import { fetchApi, type PaginatedResponse } from './base';

export interface Lead {
  id_lead: number;
  nombre: string;
  telefono?: string;
  mail?: string;
  trabajador: boolean;
  // Relational data might be included depending on the endpoint
  estado?: string; 
  ultimo_contacto?: string;
}

export type LeadFormData = Omit<Lead, 'id_lead' | 'estado' | 'ultimo_contacto'> & {
  estado?: string;
  nota_inicial?: string;
};

export async function fetchLeads(params?: { page?: number; limit?: number; search?: string; estado?: string; trabajador?: string }): Promise<PaginatedResponse<Lead>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.estado) queryParams.append('estado', params.estado);
  if (params?.trabajador) queryParams.append('trabajador', params.trabajador);

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
