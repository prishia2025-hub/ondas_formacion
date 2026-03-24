import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Mail, Phone, Trash2, Pencil } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Skeleton } from '../ui/SkeletonCard';
import type { CursoLead } from '@/api/cursoLeads';
import { useState } from 'react';

interface CursoLeadsTableProps {
  cursoId: number;
  leads?: CursoLead[];
  isLoading: boolean;
  onDeleteLead: (lead: CursoLead) => void;
  onEditLead: (lead: CursoLead) => void;
  isDeleting?: boolean;
  currentPage: number;
}

export function CursoLeadsTable({
  cursoId,
  leads,
  isLoading,
  onDeleteLead,
  onEditLead,
  isDeleting = false,
  currentPage,
}: CursoLeadsTableProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [leadToConfirm, setLeadToConfirm] = useState<CursoLead | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const handleConfirmDelete = () => {
    if (!leadToConfirm) return;
    onDeleteLead(leadToConfirm);
    setLeadToConfirm(null);
  };

  if (isLoading) return <Skeleton className="h-[320px] w-full" />;

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay leads en este curso</h3>
        <p className="text-sm text-slate-500">Añade leads desde el listado global o crea uno nuevo.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Contacto</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Creado</th>
              <th className="px-4 py-3 text-left font-semibold">Último Contacto</th>
              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id_lead}
                onClick={() => navigate(`/cursos/${cursoId}/lead/${lead.id_lead}?${searchParams.toString()}`)}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
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
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {lead.telefono && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lead.telefono}</span>
                      </div>
                    )}
                    {lead.mail && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{lead.mail}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.estado as any} label={lead.estado} />
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(lead.fecha_formulario)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(lead.ultimo_contacto)}</td>

                {/* ── Columna Acciones ── */}
                <td
                  className="px-4 py-3 text-center"
                  onClick={(e) => e.stopPropagation()} // evita navegar al detalle
                >
                  <div className="flex items-center justify-center gap-2">
                    <button
                      title="Editar lead"
                      onClick={() => onEditLead(lead)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      title="Quitar del curso"
                      onClick={() => setLeadToConfirm(lead)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Diálogo de confirmación ── */}
      {leadToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Quitar del curso</h3>
                <p className="text-sm text-slate-500 mt-0.5">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-6">
              ¿Quitar a <span className="font-semibold">"{leadToConfirm.nombre}"</span> de este curso?
              El lead seguirá existiendo en el CRM.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setLeadToConfirm(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Quitando...' : 'Sí, quitar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}