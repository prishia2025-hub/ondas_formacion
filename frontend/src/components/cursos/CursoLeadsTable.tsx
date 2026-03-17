import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton />;
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-text-primary">No hay leads en este curso</h3>
        <p className="text-text-secondary mt-1">Añade leads desde el listado global o crea uno nuevo.</p>
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
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-slate-50 text-left text-text-secondary">
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Creado</th>
            <th className="px-4 py-3 font-medium">Último Contacto</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leads.map((lead) => (
            <tr
              key={lead.id_lead}
              onClick={() => navigate(`/leads/${lead.id_lead}`)}
              className="hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 font-medium text-text-primary">
                <span>{lead.nombre}</span>
                {lead.trabajador && (
                  <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Trabajador
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-text-secondary space-y-1">
                {lead.telefono && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {lead.telefono}
                  </div>
                )}
                {lead.mail && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {lead.mail}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.estado as any} label={lead.estado} />
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {formatDate(lead.fecha_formulario)}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {formatDate(lead.ultimo_contacto)}
              </td>
              <td
                className="px-4 py-3"
                onClick={(e) => e.stopPropagation()} // evita doble navegación
              >
                <Link
                  to={`/leads/${lead.id_lead}`}
                  className="flex items-center gap-1 text-accent-from hover:underline font-medium"
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
  );
}
