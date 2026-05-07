import { fetchApi } from './base';

export interface Status {
  id: string;
  name: string;
  color: string;
}

export async function fetchStatuses(token?: string | null): Promise<Status[]> {
  return fetchApi<Status[]>('/api/statuses', undefined, token);
}

