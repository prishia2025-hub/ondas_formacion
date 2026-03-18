import { fetchApi } from './base';

export interface Status {
  id: string;
  name: string;
  color: string;
}

export async function fetchStatuses(): Promise<Status[]> {
  return fetchApi<Status[]>('/api/statuses');
}
