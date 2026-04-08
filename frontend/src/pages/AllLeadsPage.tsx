import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import { fetchLeads } from '@/api/leads';
import { AllLeadsTable } from '@/components/leads/AllLeadsTable';
import { Skeleton } from '@/components/ui/SkeletonCard';

export default function AllLeadsPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');

    const { data: leadsResponse, isLoading: isLeadsLoading } = useQuery({
        queryKey: ['all-leads', page, limit, search],
        queryFn: () => fetchLeads({ page, limit, search }),
        placeholderData: (previousData) => previousData,
    });

    const leads = leadsResponse?.items || [];
    const totalPages = leadsResponse?.pages || 1;
    const totalLeads = leadsResponse?.total || 0;

    return (
        <div>
            {/* Título */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
                {isLeadsLoading && !leadsResponse ? (
                    <Skeleton />
                ) : (
                    `${totalLeads} leads totales`
                )}
            </div>

            {/* Barra de búsqueda */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={15}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Buscar por nombre o teléfono..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-accent-from to-accent-to rounded-lg hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap">
                    <Plus size={16} />
                    Añadir Lead
                </button>
            </div>

            {/* Tabla */}
            <AllLeadsTable leads={leads} isLoading={isLeadsLoading} />

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
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
        </div>
    );
}