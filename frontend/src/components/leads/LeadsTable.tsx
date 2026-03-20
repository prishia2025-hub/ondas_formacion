import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Skeleton } from '../ui/SkeletonCard';
import { useState } from 'react';
import type { Lead } from '@/api/leads';

type SortField = 'nombre' | 'estado';
type SortDir = 'asc' | 'desc';

interface LeadsTableProps {
  leads?: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ChevronUp className="w-3 h-3 opacity-20" />;
  return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
}

export function LeadsTable({ leads, isLoading, onEdit }: LeadsTableProps) {

  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

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
        <h3 className="text-lg font-medium text-text-primary mb-1">No hay leads</h3>
        <p className="text-text-secondary">Añade tu primer lead para empezar.</p>
      </div>
    );
  }

  const sorted = [...leads].sort((a, b) => {
    let valA = '', valB = '';
    if (sortField === 'nombre') { valA = a.nombre; valB = b.nombre; }
    if (sortField === 'estado') { valA = a.estado || ''; valB = b.estado || ''; }
    return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-border">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((lead) => (
              <tr key={lead.id_lead} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    {lead.nombre}
                    {lead.trabajador && (
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Trabajador</span>
                    )}
                    {(lead.courses_count??0) > 1 && (
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        {lead.courses_count} cursos
                      </span>
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
                  <StatusBadge status={lead.estado as any} label={lead.estado || 'Nuevo'} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 text-slate-500 hover:text-accent-from hover:bg-indigo-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/leads/${lead.id_lead}`}
                      className="inline-flex items-center gap-1.5 text-accent-from hover:text-accent-to font-medium transition-colors"
                    >
                      Detalle <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
