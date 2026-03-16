import { fetchApi, type PaginatedResponse } from './base';

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

export async function fetchCursos(params?: { page?: number; limit?: number; estado?: string }): Promise<PaginatedResponse<Curso>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.estado) queryParams.append('estado', params.estado);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/cursos?${queryString}` : '/api/cursos';

  return fetchApi<PaginatedResponse<Curso>>(endpoint);
}

export async function fetchCurso(id: number): Promise<Curso> {
  return fetchApi<Curso>(`/api/cursos/${id}`);
}

export async function createCurso(data: CursoFormData): Promise<Curso> {
  return fetchApi<Curso>('/api/cursos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCurso(id: number, data: Partial<CursoFormData>): Promise<Curso> {
  return fetchApi<Curso>(`/api/cursos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCurso(id: number): Promise<void> {
  return fetchApi<void>(`/api/cursos/${id}`, {
    method: 'DELETE',
  });
}
