import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { fetchLeads, createLead, updateLead, type Lead, type LeadFormData } from '@/api/leads';
import { fetchStatuses } from '@/api/statuses';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormModal } from '@/components/leads/LeadFormModal';

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | undefined>(undefined);
  
  // Filters and Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterTrabajador, setFilterTrabajador] = useState<'Todos' | 'Trabajando' | 'No trabajando'>('Todos');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [filterEstado, filterTrabajador]);

  const { data: leadsResponse, isLoading } = useQuery({
    queryKey: ['leads', page, limit, debouncedSearch, filterEstado, filterTrabajador],
    queryFn: () => fetchLeads({ page, limit, search: debouncedSearch, estado: filterEstado, trabajador: filterTrabajador }),
    placeholderData: (previousData) => previousData, // keep previous data while fetching
  });

  const leads = leadsResponse?.items || [];
  const totalPages = leadsResponse?.pages || 1;
  const totalLeads = leadsResponse?.total || 0;

  const { data: statuses } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
    staleTime: Infinity,
  });

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LeadFormData }) => updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      handleCloseModal();
    },
  });

  // Client side filtering removed since it's handled by the backend

  const handleOpenNew = () => {
    setLeadToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLeadToEdit(undefined);
  };

  const handleSubmit = (data: LeadFormData) => {
    if (leadToEdit) {
      updateMutation.mutate({ id: leadToEdit.id_lead, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterEstado('Todos');
    setFilterTrabajador('Todos');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Todos los Leads</h1>
          <p className="text-slate-500">
            {leadsResponse ? `${totalLeads} leads en total (Página ${page} de ${totalPages})` : 'Cargando...'}
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-from to-accent-to text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" /> Añadir Lead
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-border mb-6 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Buscar</label>
          <input
            type="text"
            placeholder="Nombre o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
          />
        </div>
        <div className="w-[180px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50 bg-white"
          >
            <option value="Todos">Todos</option>
            {statuses?.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="w-[180px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Situación Laboral</label>
          <select
            value={filterTrabajador}
            onChange={(e) => setFilterTrabajador(e.target.value as any)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50 bg-white"
          >
            <option value="Todos">Todos</option>
            <option value="Trabajando">Trabajando</option>
            <option value="No trabajando">No trabajando</option>
          </select>
        </div>
        <button 
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors h-[38px]"
        >
          Limpiar
        </button>
      </div>

      <LeadsTable leads={leads} isLoading={isLoading} onEdit={handleOpenEdit} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Anterior
          </button>
          <span className="text-sm font-medium text-slate-600">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Siguiente
          </button>
        </div>
      )}

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        leadToEdit={leadToEdit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
