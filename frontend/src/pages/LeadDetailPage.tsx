import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Mail, Phone, Calendar, Briefcase, Info } from 'lucide-react';
import { fetchLead } from '@/api/leads';
import { fetchLeadNotas } from '@/api/notas';
import { fetchCurso } from '@/api/cursos';
import { NotasPanel } from '@/components/leads/NotasPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/SkeletonCard';
import { format, parseISO } from 'date-fns';

export default function LeadDetailPage() {
  const { id_lead, id_curso } = useParams<{ id_lead: string; id_curso?: string }>();
  const leadId = Number(id_lead);
  const cursoId = id_curso ? Number(id_curso) : undefined;

  const { data: lead, isLoading: isLeadLoading } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => fetchLead(leadId),
    enabled: !!leadId,
  });

  const { data: notas, isLoading: isNotasLoading } = useQuery({
    queryKey: ['notas', leadId],
    queryFn: () => fetchLeadNotas(leadId),
    enabled: !!leadId,
  });

  // Fetch curso info if we navigated from a course
  const { data: curso } = useQuery({
    queryKey: ['cursos', cursoId],
    queryFn: () => fetchCurso(cursoId!),
    enabled: !!cursoId,
  });

  if (isLeadLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return <div className="p-8 text-center text-slate-500">Lead no encontrado.</div>;
  }

  const backLink = cursoId ? `/cursos/${cursoId}` : '/leads';
  const backText = cursoId ? `Volver a ${curso?.nombre || 'Curso'}` : 'Volver a Leads';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="mb-6 flex items-center gap-2 text-sm shrink-0">
        <Link to={backLink} className="text-text-secondary hover:text-accent-from flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {backText}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch h-[calc(100%-48px)] min-h-0">
        {/* LEFT COLUMN: Lead Info & Notas */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {/* HEADER INFO CARD */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm shrink-0">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  {lead.nombre}
                  {lead.trabajador && (
                    <span className="text-xs uppercase font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                      <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                      Trabajador
                    </span>
                  )}
                </h1>
                <StatusBadge status={lead.estado as any} label={lead.estado || 'Nuevo'} className="text-sm px-3 py-1" />
              </div>
              <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                ✏️ Editar Lead
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="font-medium">{lead.telefono || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="font-medium">{lead.mail || 'Sin email'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Último contacto:</span>
                  <span className="text-sm font-medium text-slate-700">
                    {lead.ultimo_contacto ? format(parseISO(lead.ultimo_contacto), 'dd/MM/yyyy HH:mm') : 'Nunca'}
                  </span>
                </div>
                {/* Mock UI for flags if available in DB */}
                <div className="flex gap-2 mt-auto">
                  <span className="text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    WhatsApp: ✓
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                    Email: ✗
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NOTAS PANEL */}
          <div className="flex-1 min-h-0">
            <NotasPanel leadId={leadId} notas={notas} isLoading={isNotasLoading} cursoId={cursoId} />
          </div>
        </div>

        {/* RIGHT COLUMN: Context & Docs */}
        <div className="flex flex-col gap-6 h-full">
          {cursoId && curso && (
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-accent-from">
                  <Info className="w-4 h-4" />
                </span>
                Contexto del Curso
              </h3>
              <div className="space-y-3 text-sm">
                <p className="font-medium text-slate-900">{curso.nombre}</p>
                {curso.codigo && <p className="text-slate-500 font-mono">{curso.codigo}</p>}
                {curso.fecha_inicio && (
                  <div className="flex items-center gap-2 text-slate-600 mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Inicio: {format(parseISO(curso.fecha_inicio), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
