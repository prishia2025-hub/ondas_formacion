import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Mail, Phone, Calendar, Briefcase, Info, BookOpen } from 'lucide-react';
import { fetchLead } from '@/api/leads';
import { fetchLeadNotas } from '@/api/notas';
import { fetchCurso } from '@/api/cursos';
import { NotasPanel } from '@/components/leads/NotasPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/SkeletonCard';
import { format, parseISO } from 'date-fns';
import { updateCursoLead, fetchLeadCursos } from '@/api/cursoLeads';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLead, type LeadFormData } from '@/api/leads';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { CursoEstadoModal } from '@/components/leads/CursoEstadoModal';


export default function LeadDetailPage() {
  const { id_lead, id_curso } = useParams<{ id_lead: string; id_curso?: string }>();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get('fromPage');
  const leadId = Number(id_lead);
  const cursoId = id_curso ? Number(id_curso) : undefined;

  const backLink = cursoId
    ? `/cursos/${cursoId}?${searchParams.toString()}`
    : '/leads';

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

  const { data: leadCursos, isLoading: isCursosLoading } = useQuery({
    queryKey: ['lead-cursos', leadId],
    queryFn: () => fetchLeadCursos(leadId),
    enabled: !!leadId,
  });

  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data: LeadFormData) => updateLead(leadId, {
      nombre: data.nombre,
      telefono: data.telefono,
      mail: data.mail,
      trabajador: data.trabajador,
      estado: data.estado,
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      await queryClient.invalidateQueries({ queryKey: ['lead-cursos', leadId] });
      setIsEditOpen(false);
    },
  });

  const updateCursoEstadoMutation = useMutation({
    mutationFn: ({ cursoId, estado }: { cursoId: number; estado: string }) =>
      updateCursoLead(cursoId, leadId, { estado }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['lead-cursos', leadId] });
      await queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      setEditingCursoEstado(null);
    },
  });

  const [editingCursoEstado, setEditingCursoEstado] = useState<{
    id_curso: number;
    estado: string;
  } | null>(null);

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

  const backText = cursoId ? `Volver a ${curso?.nombre || 'Curso'}` : 'Volver a Leads';

  return (
    <div className="max-w-7xl mx-auto h-full min-h-0 flex flex-col">
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
              </div>
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
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
          {/* PANEL: Cursos del lead */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-accent-from">
                <BookOpen className="w-4 h-4" />
              </span>
              Cursos inscritos
            </h3>

            {isCursosLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : !leadCursos || leadCursos.length === 0 ? (
              <p className="text-sm text-slate-400">Sin cursos asignados.</p>
            ) : (
              <div className="space-y-3">
                {leadCursos.map((curso) => (
                  <div
                    key={curso.id_curso}
                    className="p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/cursos/${curso.id_curso}/lead/${leadId}`}
                        className="text-sm font-medium text-slate-800 group-hover:text-accent-from leading-snug flex-1"
                      >
                        {curso.nombre}
                      </Link>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={curso.estado as any} label={curso.estado} />
                        <button
                          onClick={() => setEditingCursoEstado({ id_curso: curso.id_curso, estado: curso.estado })}
                          className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                        >
                          ✏️ Estado
                        </button>
                      </div>
                    </div>
                    {curso.codigo && (
                      <span className="text-xs text-slate-400 font-mono mt-1 block">{curso.codigo}</span>
                    )}
                    {curso.ultimo_contacto && (
                      <span className="text-xs text-slate-400 mt-1 block">
                        Último contacto: {format(parseISO(curso.ultimo_contacto), 'dd/MM/yyyy')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* NOTAS PANEL */}
          <div className="flex-1 min-h-0 overflow-hidden">
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
      <LeadFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(data) => updateMutation.mutate(data)}
        leadToEdit={lead}
        isPending={updateMutation.isPending}
        error={(updateMutation.error as Error)?.message}
      />
      <CursoEstadoModal
        isOpen={!!editingCursoEstado}
        onClose={() => setEditingCursoEstado(null)}
        initialEstado={editingCursoEstado?.estado || ''}
        onSubmit={(estado) => {
          if (!editingCursoEstado) return;
          updateCursoEstadoMutation.mutate({
            cursoId: editingCursoEstado.id_curso,
            estado,
          });
        }}
        isPending={updateCursoEstadoMutation.isPending}
        error={(updateCursoEstadoMutation.error as Error)?.message}
      />
    </div>
  );
}
