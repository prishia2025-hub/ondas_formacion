import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Search } from 'lucide-react';
import { fetchCurso } from '@/api/cursos';
import { fetchCursoLeads } from '@/api/cursoLeads';
import { CursoLeadsTable } from '@/components/cursos/CursoLeadsTable';
import { Skeleton } from '@/components/ui/SkeletonCard';

export default function CursoLeadsPage() {
  const { id_curso } = useParams<{ id_curso: string }>();
  const cursoId = Number(id_curso);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const { data: curso, isLoading: isCursoLoading } = useQuery({
    queryKey: ['cursos', cursoId],
    queryFn: () => fetchCurso(cursoId),
    enabled: !!cursoId,
  });

  const { data: leadsResponse, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['curso-leads', cursoId, page, limit, search],
    queryFn: () => fetchCursoLeads(cursoId, { page, limit, search }),
    enabled: !!cursoId,
    placeholderData: (previousData) => previousData,
  });

  const leads = leadsResponse?.items || [];
  const totalPages = leadsResponse?.pages || 1;
  const totalLeads = leadsResponse?.total || 0;

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

      {/* Título */}
      <div>
        {isCursoLoading ? <Skeleton className="h-8 w-64" /> : <h1 className="text-2xl font-bold text-text-primary">{curso?.nombre}</h1>}
        <p className="text-sm text-text-secondary mt-1">
          {isLeadsLoading && !leadsResponse
            ? <Skeleton className="h-4 w-48" />
            : ` ${totalLeads} leads totales`
          }
        </p>
      </div>

      {/* 🔍 Barra de búsqueda */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // resetear a página 1 al buscar
          }}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
        />
      </div>

<div className="w-full lg:w-[75%] xl:w-[65%] mx-auto">
  <CursoLeadsTable
    cursoId={cursoId}
    leads={leads}
    isLoading={isLeadsLoading}
  />
</div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLeadsLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Anterior
          </button>
          <span className="text-sm text-text-secondary">Página {page} de {totalPages}</span>
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
