import { Link } from 'react-router-dom';
import { Edit2, Users } from 'lucide-react';
import type { Curso } from '@/api/cursos';
import { StatusBadge } from '../ui/StatusBadge';
import { format, parseISO } from 'date-fns';

interface CursoCardProps {
  curso: Curso;
  onEdit: (curso: Curso) => void;
}

export function CursoCard({ curso, onEdit }: CursoCardProps) {
  // Determine badge state
  let estadoType: "activo" | "lleno" | "inactivo" = "activo";
  let estadoText = "ACTIVO";

  if (!curso.activo) {
    estadoType = "inactivo";
    estadoText = "INACTIVO";
  } else if (curso.lleno) {
    estadoType = "lleno";
    estadoText = "LLENO";
  }

  const formatNullableDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/cursos/${curso.id_curso}`} className="text-lg font-bold text-text-primary hover:text-accent-from transition-colors line-clamp-2">
            {curso.nombre}
          </Link>
          <StatusBadge estadoCurso={estadoType} label={estadoText} />
        </div>

        {curso.codigo && (
          <p className="text-sm text-text-secondary mb-3 font-mono bg-slate-50 px-2 py-1 rounded inline-block">
            {curso.codigo}
          </p>
        )}

        <div className="text-sm text-text-secondary space-y-1 mb-4">
          {(curso.fecha_inicio || curso.fecha_fin) && (
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              {formatNullableDate(curso.fecha_inicio)}
              {curso.fecha_fin && ` → ${formatNullableDate(curso.fecha_fin)}`}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
          <Users className="w-4 h-4 text-accent-from" />
          <span>{curso.leads_count ?? 0}</span>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); onEdit(curso); }}
          className="relative z-10 p-2 text-text-secondary hover:text-accent-from hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Invisible link covering card except for the edit button */}
      <Link to={`/cursos/${curso.id_curso}`} className="absolute inset-0 z-0" aria-label={`Ver curso ${curso.nombre}`} />
    </div>
  );
}
