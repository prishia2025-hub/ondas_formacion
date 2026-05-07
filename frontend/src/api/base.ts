import { apiFetch } from '../lib/api-client';

export const API_URL = import.meta.env.VITE_API_URL || ''

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export type Fetcher = <T>(path: string, options?: RequestInit) => Promise<T>;

export async function fetchApi<T>(endpoint: string, options?: RequestInit, token?: string | null): Promise<T> {
  return apiFetch<T>(endpoint, options, token);
}

