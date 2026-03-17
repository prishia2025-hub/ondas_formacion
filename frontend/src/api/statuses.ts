import { fetchApi } from './base';

// "Nuevo", "Contactado", "Pendiente de documentación", "Inscrito", "Reserva", "No interesado"
export async function fetchStatuses(): Promise<string[]> {
  return fetchApi<string[]>('/api/statuses');
}
