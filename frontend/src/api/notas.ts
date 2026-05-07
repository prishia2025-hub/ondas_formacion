import { fetchApi } from './base';

export interface Nota {
  id_nota: number;
  id_lead: number;
  id_curso?: number;
  titulo?: string;
  contenido: string;
  fecha: string;
}

export type NotaFormData = Omit<Nota, 'id_nota' | 'fecha'>;

export async function fetchLeadNotas(leadId: number, token?: string | null): Promise<Nota[]> {
  return fetchApi<Nota[]>(`/api/leads/${leadId}/notas`, undefined, token);
}

export async function createNota(leadId: number, data: Omit<NotaFormData, 'id_lead'>, token?: string | null): Promise<Nota> {
  return fetchApi<Nota>(`/api/leads/${leadId}/notas`, {
    method: 'POST',
    body: JSON.stringify({ ...data, id_lead: leadId }),
  }, token);
}
export async function deleteNota(leadId: number, notaId: number, token?: string | null): Promise<void> {
  return fetchApi(`/api/leads/${leadId}/notas/${notaId}`, {
    method: 'DELETE',
  }, token);
}


