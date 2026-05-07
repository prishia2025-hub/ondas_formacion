import type {  PaginatedResponse, Fetcher } from './base';

export interface Curso {
  id_curso: number;
  nombre: string;
  codigo?: string;
  max_alumnos?: number;
  activo: boolean;
  lleno: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
  horario?: string;
  horas_totales?: number;
  para_trabajadores: boolean;
  // Extras returned by backend if any:
  leads_count?: number; 
}

export type CursoFormData = Omit<Curso, 'id_curso'>;


export async function fetchCursos(
  fetch: Fetcher,
  params?: { page?: number; limit?: number; estado?: string }
): Promise<PaginatedResponse<Curso>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.estado) queryParams.append('estado', params.estado);

  const qs = queryParams.toString();
  return fetch(`/api/cursos${qs ? `?${qs}` : ''}`);
}

export async function createCurso(fetch: Fetcher, data: CursoFormData): Promise<Curso> {
  return fetch('/api/cursos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchCurso(fetch: Fetcher, id: number): Promise<Curso> {
  return fetch(`/api/cursos/${id}`);
}


export async function updateCurso(fetch: Fetcher, id: number, data: Partial<CursoFormData>): Promise<Curso> {
  return fetch(`/api/cursos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCurso(fetch: Fetcher, id: number): Promise<void> {
  return fetch(`/api/cursos/${id}`, {
    method: 'DELETE',
  });
}

