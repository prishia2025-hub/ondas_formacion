import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import { fetchLeads, createLead, updateLead, type LeadFormData, type Lead } from '@/api/leads';
import { AllLeadsTable } from '@/components/leads/AllLeadsTable';
import { Skeleton } from '@/components/ui/SkeletonCard';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { useSearchParams } from 'react-router-dom';


export default function AllLeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [limit] = useState(10);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [trabajadorFilter, setTrabajadorFilter] = useState(searchParams.get('trabajador') || 'Todos');
  const [sortField, setSortField] = useState<'nombre' | 'fecha_creacion' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = useState(false);
const [origenFilter, setOrigenFilter] = useState(searchParams.get('origen') || 'Todos');
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    if (search) params.set('search', search); else params.delete('search');
    if (origenFilter !== 'Todos') params.set('origen', origenFilter); else params.delete('origen');
    if (trabajadorFilter !== 'Todos') params.set('trabajador', trabajadorFilter); else params.delete('trabajador');

    setSearchParams(params, { replace: true });
  }, [page, search, origenFilter, trabajadorFilter]);

  function handleSort(field: 'nombre' | 'fecha_creacion') {
    if (sortField !== field) { setSortField(field); setSortDir('asc'); return; }
    if (sortDir === 'asc') { setSortDir('desc'); return; }
    setSortField(null);
  }

  const { data: leadsResponse, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['all-leads', page, limit, search, origenFilter, trabajadorFilter, sortField, sortDir],
    queryFn: () => fetchLeads({
      page,
      limit,
      search,
      origen: origenFilter !== 'Todos' ? origenFilter : undefined,
      trabajador: trabajadorFilter !== 'Todos' ? trabajadorFilter : undefined,
      sort_by: sortField ?? undefined,
      sort_dir: sortDir,
    }),
    placeholderData: (previousData) => previousData,
  });

  const leads = leadsResponse?.items || [];
  const totalPages = leadsResponse?.pages || 1;
  const totalLeads = leadsResponse?.total || 0;

  const createMutation = useMutation({
    mutationFn: (data: LeadFormData) => createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leads'] });
      setIsAddOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LeadFormData }) => updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leads'] });
      setIsEditOpen(false);
      setLeadToEdit(undefined);
    },
  });

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 p-6">

      {/* Título */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
        {isLeadsLoading && !leadsResponse
          ? <Skeleton className="h-4 w-28 mt-1" />
          : <p className="text-sm text-slate-500 mt-1">{totalLeads} leads totales</p>
        }
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Buscador */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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

        {/* Filtro Trabajador */}
        <select
          value={trabajadorFilter}
          onChange={(e) => { setTrabajadorFilter(e.target.value); setPage(1); }}
          className="py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700"
        >
          <option value="Todos">Todos</option>
          <option value="Trabajando">Trabajando</option>
          <option value="No trabajando">No trabajando</option>
        </select>

        {/* Botón Añadir */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-accent-from to-accent-to rounded-lg hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Añadir Lead
        </button>
      </div>

      {/* Tabla */}
      <AllLeadsTable
        leads={leads}
        isLoading={isLeadsLoading}
        onEdit={handleEditLead}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLeadsLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-500">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLeadsLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal crear */}
      <LeadFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
        error={(createMutation.error as Error)?.message}
      />

      {/* Modal editar */}
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