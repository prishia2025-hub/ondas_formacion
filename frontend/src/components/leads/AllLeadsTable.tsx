import { Link } from 'react-router-dom';
import { Mail, Phone, Edit2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Skeleton } from '../ui/SkeletonCard';
import type { Lead } from '@/api/leads';

interface AllLeadsTableProps {
  leads?: Lead[];
  isLoading: boolean;
  onEdit?: (lead: Lead) => void;
}

export function AllLeadsTable({ leads, isLoading, onEdit }: AllLeadsTableProps) {
  if (isLoading) {
    return <Skeleton />;
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-slate-500 font-medium">No hay leads</h3>
        <p className="text-slate-400 text-sm mt-1">Añade tu primer lead para empezar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-border">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">Nombre</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">Contacto</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">Estado</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id_lead} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-800">
                {lead.nombre}
                {lead.trabajador && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Trabajador
                  </span>
                )}
                {(lead.courses_count ?? 0) > 1 && (
                  <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {lead.courses_count} cursos
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 space-y-0.5">
                {lead.telefono && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} /> {lead.telefono}
                  </div>
                )}
                {lead.mail && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} /> {lead.mail}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge estado={lead.estado} />
              </td>
              <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 text-slate-500 hover:text-accent-from hover:bg-indigo-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={15} />
                  </button>
                )}
                <Link
                  to={`/leads/${lead.id_lead}`}
                  className="p-1.5 text-slate-500 hover:text-accent-from hover:bg-indigo-50 rounded transition-colors"
                >
                  Detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}