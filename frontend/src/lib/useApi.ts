import { useCallback } from 'react';
import { useAuth } from './auth';
import { apiFetch } from './api-client';

export function useApi() {
  const { token } = useAuth();

  const fetchWithAuth = useCallback(
    <T>(path: string, options?: RequestInit) => {
      return apiFetch<T>(path, options ?? {}, token);
    },
    [token] // se regenera solo si el token cambia
  );

  return { fetchWithAuth };
}