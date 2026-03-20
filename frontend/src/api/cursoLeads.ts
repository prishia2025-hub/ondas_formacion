import { fetchApi, type PaginatedResponse } from './base';
import type { Lead } from './leads';

export interface CursoLead extends Lead {
  estado: string;
  whatsapp_enviado: boolean;
  mail_enviado: boolean;
  fecha_formulario?: string;
  ultimo_contacto?: string;
  courses_count?: number;
}

export interface LeadCursoEntry {
  id_curso: number;
  nombre: string;
  codigo?: string;
  estado: string;
  ultimo_contacto?: string;
  fecha_formulario?: string;
  activo?: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export async function fetchCursoLeads(
  cursoId: number, 
  params?: { 
    page?: number; 
    limit?: number; 
    search?: string 
    estado?: string;
    trabajador?: string;
    }
  ): Promise<PaginatedResponse<CursoLead>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.estado) queryParams.append('estado', params.estado);
  if (params?.trabajador) queryParams.append('trabajador', params.trabajador);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/cursos/${cursoId}/leads?${queryString}` : `/api/cursos/${cursoId}/leads`;

  return fetchApi<PaginatedResponse<CursoLead>>(endpoint);
}

export async function addLeadToCurso(cursoId: number, leadId: number, data?: any): Promise<void> {
  return fetchApi<void>(`/api/cursos/${cursoId}/leads`, {
    method: 'POST',
    body: JSON.stringify({ id_lead: leadId, ...data }),
  });
}

export async function updateCursoLead(cursoId: number, leadId: number, data: any): Promise<void> {
  return fetchApi<void>(`/api/cursos/${cursoId}/leads/${leadId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function removeLeadFromCurso(cursoId: number, leadId: number): Promise<void> {
  return fetchApi<void>(`/api/cursos/${cursoId}/leads/${leadId}`, {
    method: 'DELETE',
  });
}

export async function fetchLeadCursos(leadId: number): Promise<LeadCursoEntry[]> {
  return fetchApi<LeadCursoEntry[]>(`/api/leads/${leadId}/cursos`);
}
