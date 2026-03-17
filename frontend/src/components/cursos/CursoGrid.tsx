import { CursoCard } from './CursoCard';
import { SkeletonCard } from '../ui/SkeletonCard';
import type { Curso } from '@/api/cursos';

interface CursoGridProps {
  cursos?: Curso[];
  isLoading: boolean;
  onEdit: (curso: Curso) => void;
}

export function CursoGrid({ cursos, isLoading, onEdit }: CursoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!cursos || cursos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <h3 className="text-lg font-medium text-text-primary mb-1">No hay cursos</h3>
        <p className="text-text-secondary">Crea un nuevo curso para empezar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cursos.map((curso) => (
        <div key={curso.id_curso} className="relative z-10">
          <CursoCard curso={curso} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
}
