import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Search, Plus } from 'lucide-react';
import { fetchCurso } from '@/api/cursos';
import { fetchCursoLeads, addLeadToCurso, removeLeadFromCurso, type CursoLead } from '@/api/cursoLeads';
import { CursoLeadsTable } from '@/components/cursos/CursoLeadsTable';
import { Skeleton } from '@/components/ui/SkeletonCard';
import { createLead, updateLead, type LeadFormData, type Lead } from '@/api/leads';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { fetchStatuses } from '@/api/statuses';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/lib/auth';
import { useApi } from '@/lib/useApi';



export default function CursoLeadsPage() {
  const { user, token } = useAuth();
  const api = useApi();
  const { id_curso } = useParams<{ id_curso: string }>();

  const cursoId = Number(id_curso);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page') || 1);

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(10);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [estadoFilter, setEstadoFilter] = useState(searchParams.get('estado') || 'Todos');
  const [trabajadorFilter, setTrabajadorFilter] = useState(searchParams.get('trabajador') || 'Todos');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [origenFilter, setOrigenFilter] = useState(searchParams.get('origen') || 'Todos');
  const [sortField, setSortField] = useState<'nombre' | 'fecha_creacion' | null>(null);

  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(field: 'nombre' | 'fecha_creacion') {
    if (sortField !== field) { setSortField(field); setSortDir('asc'); return; }
    if (sortDir === 'asc') { setSortDir('desc'); return; }
    setSortField(null);
  }


  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    if (search) params.set('search', search); else params.delete('search');
    if (estadoFilter !== 'Todos') params.set('estado', estadoFilter); else params.delete('estado');
    if (trabajadorFilter !== 'Todos') params.set('trabajador', trabajadorFilter); else params.delete('trabajador');
    if (origenFilter !== 'Todos') params.set('origen', origenFilter); else params.delete('origen');

    setSearchParams(params, { replace: true });
  }, [page, search, estadoFilter, origenFilter, trabajadorFilter]);

  const { data: curso, isLoading: isCursoLoading } = useQuery({
    queryKey: ['cursos', cursoId],
    queryFn: () => fetchCurso(api.fetchWithAuth, cursoId),
    enabled: !!cursoId,
  });

  const { data: statuses } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => fetchStatuses(token),
    staleTime: Infinity,
    enabled: !!token,
  });

  const { data: leadsResponse, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['curso-leads', cursoId, page, limit, search, origenFilter, estadoFilter, trabajadorFilter, sortField, sortDir],
    queryFn: () => fetchCursoLeads(cursoId, {
      page, limit, search, origen: origenFilter, estado: estadoFilter, trabajador: trabajadorFilter, sort_by: sortField ?? undefined, sort_dir: sortDir,
    }, token),
    enabled: !!cursoId && !!token,
    placeholderData: (previousData) => previousData,
  });

  const leads = leadsResponse?.items || [];
  const totalPages = leadsResponse?.pages || 1;
  const totalLeads = leadsResponse?.total || 0;

  const createMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const newLead = await createLead(data, token);
      await addLeadToCurso(cursoId, newLead.id_lead, undefined, token);
      return newLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curso-leads', cursoId] });
      setIsAddOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LeadFormData }) => updateLead(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curso-leads', cursoId] });
      setIsEditOpen(false);
      setLeadToEdit(undefined);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (leadId: number) => removeLeadFromCurso(cursoId, leadId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curso-leads', cursoId] });
    },
  });

  const handleEditLead = (lead: CursoLead) => {
    setLeadToEdit(lead as unknown as Lead);
    setIsEditOpen(true);
  };

  const handleDeleteLead = (lead: CursoLead) => {
    removeMutation.mutate(lead.id_lead);
  };


  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/cursos" className="flex items-center gap-1 hover:text-accent-from transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Volver a Cursos
        </Link>
        <span>/</span>
        {isCursoLoading ? <Skeleton className="h-4 w-32" /> : <span className="text-text-primary font-medium">{curso?.nombre}</span>}
      </div>

      <div className="mb-6">
        <div className="mb-4">
          {isCursoLoading ? <Skeleton className="h-8 w-64" /> : <h1 className="text-2xl font-bold text-text-primary">{curso?.nombre}</h1>}
          <div className="text-sm text-text-secondary mt-1">
            {isLeadsLoading && !leadsResponse
              ? <Skeleton className="h-4 w-48" />
              : `${totalLeads} leads totales`
            }
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre o teléfono..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Filtro origen */}
          <select
            value={origenFilter}
            onChange={(e) => { setOrigenFilter(e.target.value); setPage(1); }}
            className="py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700"
          >
            <option value="Todos">Todos los orígenes</option>
            <option value="META">META</option>
            <option value="TikTok">TikTok</option>
          </select>

          <select
            value={estadoFilter}
            onChange={(e) => { setEstadoFilter(e.target.value); setPage(1); }}
            className="py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700"
          >
            <option value="Todos">Todos los estados</option>
            {statuses?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select
            value={trabajadorFilter}
            onChange={(e) => { setTrabajadorFilter(e.target.value); setPage(1); }}
            className="py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700"
          >
            <option value="Todos">Todos</option>
            <option value="Trabajando">Trabajando</option>
            <option value="No trabajando">No trabajando</option>
          </select>

          {user?.rol === 'admin' && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-accent-from to-accent-to rounded-lg hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Añadir Lead
            </button>
          )}

        </div>
      </div>

      <div className="w-full lg:w-[85%] xl:w-[90%] mx-auto">
        <CursoLeadsTable
          cursoId={cursoId}
          leads={leads}
          isLoading={isLeadsLoading}
          onDeleteLead={handleDeleteLead}
          onEditLead={handleEditLead}
          isDeleting={removeMutation.isPending}
          currentPage={page}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            isLoading={isLeadsLoading}
          />
        </div>
      )}

      {/* Modal: crear lead */}
      <LeadFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
        error={(createMutation.error as Error)?.message}
      />

      {/* Modal: editar lead */}
      <LeadFormModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setLeadToEdit(undefined); }}
        onSubmit={(data) => leadToEdit && updateMutation.mutate({ id: leadToEdit.id_lead, data })}
        leadToEdit={leadToEdit}
        isPending={updateMutation.isPending}
        error={(updateMutation.error as Error)?.message}
      />
    </div>
  );
}
