import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { fetchCurso } from '@/api/cursos';
import { fetchCursoLeads } from '@/api/cursoLeads';
import { CursoLeadsTable } from '@/components/cursos/CursoLeadsTable';
import { Skeleton } from '@/components/ui/SkeletonCard';

export default function CursoLeadsPage() {
  const { id_curso } = useParams<{ id_curso: string }>();
  const cursoId = Number(id_curso);

  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  const { data: curso, isLoading: isCursoLoading } = useQuery({
    queryKey: ['cursos', cursoId],
    queryFn: () => fetchCurso(cursoId),
    enabled: !!cursoId,
  });

  const { data: leadsResponse, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['curso-leads', cursoId, page, limit],
    queryFn: () => fetchCursoLeads(cursoId, { page, limit }),
    enabled: !!cursoId,
    placeholderData: (previousData) => previousData,
  });

  const leads = leadsResponse?.items || [];
  const totalPages = leadsResponse?.pages || 1;
  const totalLeads = leadsResponse?.total || 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link to="/cursos" className="text-text-secondary hover:text-accent-from flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Volver a Cursos
        </Link>
        <span className="text-slate-300">/</span>
        {isCursoLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <span className="font-medium text-slate-900">{curso?.nombre}</span>
        )}
      </div>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {isCursoLoading ? <Skeleton className="h-8 w-64" /> : curso?.nombre}
          </h1>
          <p className="text-slate-500">
            {isLeadsLoading && !leadsResponse ? (
              <Skeleton className="h-4 w-40 mt-2" />
            ) : (
              `${totalLeads} leads totales`
            )}
          </p>
        </div>

        {/* Placeholder for add lead to course button if needed */}
        {/* <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
          Añadir Lead
        </button> */}
      </div>

      <CursoLeadsTable
        cursoId={cursoId}
        leads={leads}
        isLoading={isLeadsLoading}
      />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLeadsLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Anterior
          </button>
          <span className="text-sm font-medium text-slate-600">
            Página {page} de {totalPages}
          </span>
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
