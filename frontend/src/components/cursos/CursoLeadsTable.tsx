import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Skeleton } from '../ui/SkeletonCard';
import type { CursoLead } from '@/api/cursoLeads';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'nombre' | 'fecha_formulario' | 'ultimo_contacto';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  const isActive = field === sortField;
  const Icon = !isActive || sortDir === 'asc' ? ChevronUp : ChevronDown;

  return (
    <span className={`inline-flex items-center justify-center w-4 h-4 rounded border shadow-sm
      ${isActive
        ? 'bg-white border-indigo-200 text-indigo-500'
        : 'bg-white border-slate-200 text-slate-400'
      }`}
    >
      <Icon className="w-2.5 h-2.5" />
    </span>
  );
}

interface CursoLeadsTableProps {
  cursoId: number;
  leads?: CursoLead[];
  isLoading: boolean;
}

export function CursoLeadsTable({ cursoId, leads, isLoading }: CursoLeadsTableProps) {
  const navigate = useNavigate();

  const [sortField, setSortField] = useState<SortField>('ultimo_contacto');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

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
  }


  const sorted = [...leads].sort((a, b) => {
    if (sortField === 'nombre') {
      return sortDir === 'asc'
        ? (a.nombre || '').localeCompare(b.nombre || '')
        : (b.nombre || '').localeCompare(a.nombre || '');
    }
    const valA = a[sortField] ? new Date(a[sortField]!).getTime() : 0;
    const valB = b[sortField] ? new Date(b[sortField]!).getTime() : 0;
    return sortDir === 'asc' ? valA - valB : valB - valA;
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              onClick={() => handleSort('nombre')}>
              <div className="flex items-center gap-1">
                Nombre <SortIcon field="nombre" sortField={sortField} sortDir={sortDir} />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Contacto</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              onClick={() => handleSort('fecha_formulario')}>
              <div className="flex items-center gap-1">
                Creado <SortIcon field="fecha_formulario" sortField={sortField} sortDir={sortDir} />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              onClick={() => handleSort('ultimo_contacto')}>
              <div className="flex items-center gap-1">
                Último Contacto <SortIcon field="ultimo_contacto" sortField={sortField} sortDir={sortDir} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {sorted.map((lead) => (
            <tr
              key={lead.id_lead}
              onClick={() => navigate(`/cursos/${cursoId}/lead/${lead.id_lead}`)} className="cursor-pointer bg-white transition-colors hover:bg-slate-100"
            >
              <td className="px-4 py-3 font-medium text-text-primary">
                <span>{lead.nombre}</span>
                {lead.trabajador && (
                  <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Trabajador
                  </span>
                )}
                {(lead.courses_count ?? 0) > 1 && (
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {lead.courses_count} cursos
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

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
