const API_URL = import.meta.env.VITE_API_URL || '';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  const finalToken = token || authToken;
  if (finalToken) {
    headers.set('Authorization', `Bearer ${finalToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (null as unknown as T);
}

