const API_URL = import.meta.env.VITE_API_URL || '';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token: string | null = null  // siempre explícito, nunca implícito
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    const cleanToken = token.replace('Bearer ', '').replace(/"/g, '').trim();
    headers.set('Authorization', `Bearer ${cleanToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401) throw new Error('Unauthorized');
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (null as unknown as T);
}