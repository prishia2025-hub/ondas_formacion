import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Mail, Phone, Pencil, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Skeleton } from '../ui/SkeletonCard';
import type { Lead } from '@/api/leads';

interface AllLeadsTableProps {
  leads?: Lead[];
  isLoading: boolean;
  onEdit?: (lead: Lead) => void;
  sortField?: 'nombre' | 'fecha_creacion' | null;
  sortDir?: 'asc' | 'desc';
  onSort?: (field: 'nombre' | 'fecha_creacion') => void;
}

// Icono de ordenación para la cabecera
function SortIcon({ field, sortField, sortDir }: {
  field: 'nombre' | 'fecha_creacion';
  sortField?: 'nombre' | 'fecha_creacion' | null;
  sortDir?: 'asc' | 'desc';
}) {
  if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-300" />;
  if (sortDir === 'asc') return <ChevronUp className="w-3.5 h-3.5 ml-1 text-indigo-500" />;
  return <ChevronDown className="w-3.5 h-3.5 ml-1 text-indigo-500" />;
}

// Formatea una fecha ISO a dd/MM/yyyy HH:mm
const formatFecha = (fecha?: string) =>
  fecha ? format(parseISO(fecha), 'dd/MM/yyyy HH:mm') : '—';

export function AllLeadsTable({ leads, isLoading, onEdit, sortField, sortDir, onSort }: AllLeadsTableProps) {
  const navigate = useNavigate();

  if (isLoading) return <Skeleton />;

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="font-semibold text-slate-700">No hay leads</h3>
        <p className="text-sm text-slate-500 mt-1">Añade tu primer lead para empezar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {/* Nombre — clicable para ordenar */}
            <th className="text-left px-4 py-3 font-medium text-slate-500">
              <button
                onClick={() => onSort?.('nombre')}
                className="flex items-center hover:text-slate-800 transition-colors"
              >
                Nombre
                <SortIcon field="nombre" sortField={sortField} sortDir={sortDir} />
              </button>
            </th>

            <th className="text-left px-4 py-3 font-medium text-slate-500">Contacto</th>
            {/* Creado — clicable para ordenar */}
            <th className="text-left px-4 py-3 font-medium text-slate-500">
              <button
                onClick={() => onSort?.('fecha_creacion')}
                className="flex items-center hover:text-slate-800 transition-colors"
              >
                Creado
                <SortIcon field="fecha_creacion" sortField={sortField} sortDir={sortDir} />
              </button>
            </th>

            {/* Último Contacto — igual que CursoLeadsTable */}
            <th className="text-left px-4 py-3 font-medium text-slate-500">Último Contacto</th>

            <th className="text-left px-4 py-3 font-medium text-slate-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr
              key={lead.id_lead}
              onClick={() => navigate(`/leads/${lead.id_lead}`)}
              className="cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {/* Nombre + badges */}
              <td className="px-4 py-3">
                <span className="font-medium text-slate-800">{lead.nombre}</span>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  {lead.trabajador && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                      Trabajador
                    </span>
                  )}
                  {(lead.courses_count ?? 0) > 1 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {lead.courses_count} cursos
                    </span>
                  )}
                </div>
              </td>

              {/* Contacto */}
              <td className="px-4 py-3 text-slate-600">
                {lead.telefono && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />{lead.telefono}
                  </div>
                )}
                {lead.mail && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />{lead.mail}
                  </div>
                )}
              </td>

              {/* Creado */}
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                {formatFecha(lead.fecha_creacion)}
              </td>

              {/* Último Contacto */}
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                {formatFecha(lead.ultimo_contacto)}
              </td>

              {/* Acciones */}
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}