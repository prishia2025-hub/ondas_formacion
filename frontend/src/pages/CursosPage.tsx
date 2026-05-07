import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { fetchCursos, createCurso, updateCurso, type Curso, type CursoFormData } from '@/api/cursos';
import { CursoGrid } from '@/components/cursos/CursoGrid';
import { CursoFormModal } from '@/components/cursos/CursoFormModal';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';


export default function CursosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<'activos' | 'inactivos' | 'todos'>('activos');
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursoToEdit, setCursoToEdit] = useState<Curso | undefined>(undefined);

  const { data: cursosResponse, isLoading } = useQuery({
    queryKey: ['cursos', page, limit, filter],
    queryFn: () => fetchCursos({ page, limit, estado: filter }),
    placeholderData: (previousData) => previousData,
  });

  const cursos = cursosResponse?.items || [];
  const totalPages = cursosResponse?.pages || 1;
  const totalCursos = cursosResponse?.total || 0;

  const createMutation = useMutation({
    mutationFn: createCurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CursoFormData }) => updateCurso(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      handleCloseModal();
    },
  });

  // Client side filtering removed since it's handled by the backend

  const handleOpenNew = () => {
    setCursoToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (curso: Curso) => {
    setCursoToEdit(curso);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCursoToEdit(undefined);
  };

  const handleSubmit = (data: CursoFormData) => {
    if (cursoToEdit) {
      updateMutation.mutate({ id: cursoToEdit.id_curso, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            ℹ️
          </div>
          <p className="text-sm font-medium text-slate-700">Selecciona un curso para ver sus leads y detalles.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => { setFilter('activos'); setPage(1); }}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              filter === 'activos' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Activos
          </button>
          <button
            onClick={() => { setFilter('inactivos'); setPage(1); }}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              filter === 'inactivos' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Inactivos
          </button>
          <button
            onClick={() => { setFilter('todos'); setPage(1); }}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              filter === 'todos' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Todos
          </button>
        </div>

        {user?.rol === 'admin' && (
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-from to-accent-to text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nuevo Curso
          </button>
        )}

      </div>

      <CursoGrid cursos={cursos} isLoading={isLoading} onEdit={handleOpenEdit} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Anterior
          </button>
          <span className="text-sm font-medium text-slate-600">
            Página {page} de {totalPages} ({totalCursos} cursos en total)
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

      <CursoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        cursoToEdit={cursoToEdit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
