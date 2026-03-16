import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Skeleton } from '../ui/SkeletonCard';
import type { CursoLead } from '@/api/cursoLeads';

interface CursoLeadsTableProps {
  cursoId: number;
  leads?: CursoLead[];
  isLoading: boolean;
}

export function CursoLeadsTable({ cursoId, leads, isLoading }: CursoLeadsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <h3 className="text-lg font-medium text-text-primary mb-1">No hay leads en este curso</h3>
        <p className="text-text-secondary">Añade leads desde el listado global o crea uno nuevo.</p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-border">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3">Último Contacto</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id_lead} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    {lead.nombre}
                    {lead.trabajador && (
                      <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Trabajador</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {lead.telefono && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lead.telefono}</span>
                      </div>
                    )}
                    {lead.mail && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{lead.mail}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.estado as any} label={lead.estado} />
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(lead.fecha_formulario)}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(lead.ultimo_contacto)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/cursos/${cursoId}/lead/${lead.id_lead}`}
                    className="inline-flex items-center gap-1.5 text-accent-from hover:text-accent-to font-medium transition-colors"
                  >
                    Ver detalle
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
