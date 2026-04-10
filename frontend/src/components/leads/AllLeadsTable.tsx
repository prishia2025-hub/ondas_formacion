import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Mail, Phone, Pencil, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
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


// Formatea una fecha ISO a dd/MM/yyyy HH:mm
const formatFecha = (fecha?: string) =>
  fecha ? format(parseISO(fecha), 'dd/MM/yyyy HH:mm') : '—';



function getEstadoStyle(estado: string): string {
  switch (estado) {
    case 'Inscrito':              return 'bg-emerald-100 text-emerald-700';
    case 'Contactado':            return 'bg-cyan-100 text-cyan-700';
    case 'Reserva':               return 'bg-violet-100 text-violet-700';
    case 'Pendiente de documentación': return 'bg-amber-100 text-amber-700';
    case 'No interesado':         return 'bg-slate-100 text-slate-500';
    case 'Nuevo':
    default:                      return 'bg-blue-100 text-blue-600';
  }
}

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
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-border">
          <tr>
            {/* Nombre — clicable para ordenar */}
            <th className="text-left px-4 py-3 font-medium text-slate-500">
              <button
                onClick={() => onSort?.('nombre')}
                className="flex items-center hover:text-slate-800 transition-colors"
              >
                Nombre
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
              </button>
            </th>

            {/* Último Contacto — igual que CursoLeadsTable */}
            <th className="text-left px-4 py-3 font-medium text-slate-500">Último Contacto</th>

            {/* Cursos */}
            <th className="text-left px-4 py-3 font-medium text-slate-500">Cursos</th>

            <th className="text-left px-4 py-3 font-medium text-slate-500">Acciones</th>
          </tr>
        </thead>
          <tbody className="divide-y divide-border">
          {leads.map((lead) => (
            <tr
              key={lead.id_lead}
              onClick={() => navigate(`/leads/${lead.id_lead}${location.search}`)}
              className="cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {/* Nombre + badges */}
              <td className="px-4 py-3">
                <span className="font-medium text-slate-800">{lead.nombre}</span>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  {lead.trabajador && (
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Trabajador
                    </span>
                  )}
                  {(lead.courses_count ?? 0) > 1 && (
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
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

              {/* Cursos */}
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {(lead.cursos_lead ?? []).map((c) => (
                    <span
                      key={c.codigo}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getEstadoStyle(c.estado)}`}
                    >
                      {c.codigo}
                    </span>
                  ))}
                  {(!lead.cursos_lead || lead.cursos_lead.length === 0) && (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </div>
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
    </div>
  );
}