import { apiFetch } from '@/lib/api-client';

export interface User {
  id_usuario: number;
  username: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'operador';
  activo: boolean;
  created_at?: string;
}

export interface UserFormData {
  nombre: string;
  email: string;
  username: string;
  rol: 'admin' | 'operador';
  password?: string;
}

export async function fetchUsers(token?: string | null): Promise<User[]> {
  return apiFetch<User[]>('/api/usuarios', {}, token);
}

export async function fetchMe(token?: string | null): Promise<User> {
  return apiFetch<User>('/api/auth/me', {}, token);
}

export async function updateMe(data: Partial<UserFormData>, token?: string | null): Promise<User> {
  return apiFetch<User>('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}

export async function fetchUser(id: number, token?: string | null): Promise<User> {

  return apiFetch<User>(`/api/usuarios/${id}`, {}, token);
}

export async function createUser(data: UserFormData, token?: string | null): Promise<User> {
  // En creación, el password es obligatorio para el backend (aunque podemos poner uno por defecto aquí si queremos)
  const payload = { ...data, password: data.password || 'Ondas2025!' };
  return apiFetch<User>('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function updateUser(id: number, data: Partial<UserFormData>, token?: string | null): Promise<User> {
  return apiFetch<User>(`/api/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}

export async function deleteUser(id: number, token?: string | null): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/usuarios/${id}`, {
    method: 'DELETE',
  }, token);
}
