import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { fetchCursos, createCurso, updateCurso, deleteCurso, type Curso, type CursoFormData } from '@/api/cursos';
import { CursoGrid } from '@/components/cursos/CursoGrid';
import { CursoFormModal } from '@/components/cursos/CursoFormModal';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useApi } from '@/lib/useApi';


export default function CursosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  const [filter, setFilter] = useState<'activos' | 'inactivos' | 'todos'>('activos');
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursoToEdit, setCursoToEdit] = useState<Curso | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDeleteCurso, setConfirmDeleteCurso] = useState<Curso | null>(null);

  const { data: cursosResponse, isLoading } = useQuery({
    queryKey: ['cursos', page, limit, filter],
    queryFn: () => fetchCursos(fetchWithAuth, { page, limit, estado: filter }),
    placeholderData: (previousData) => previousData,
  });


  const cursos = cursosResponse?.items || [];
  const totalPages = cursosResponse?.pages || 1;
  const totalCursos = cursosResponse?.total || 0;

  const createMutation = useMutation({
    mutationFn: (data: CursoFormData) => createCurso(fetchWithAuth, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setSuccessMessage("Curso creado correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CursoFormData }) =>
      updateCurso(fetchWithAuth, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setSuccessMessage("Curso guardado correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCurso(fetchWithAuth, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setSuccessMessage("Curso eliminado correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);
      setConfirmDeleteCurso(null);
    },
  });

  const handleOpenNew = () => {
    setCursoToEdit(undefined);
    setIsModalOpen(true);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleOpenEdit = (curso: Curso) => {
    setCursoToEdit(curso);
    setIsModalOpen(true);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCursoToEdit(undefined);
    createMutation.reset();
    updateMutation.reset();
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
      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

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

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-from to-accent-to text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nuevo Curso
          </button>

      </div>

      <CursoGrid cursos={cursos} isLoading={isLoading} onEdit={handleOpenEdit} onDelete={setConfirmDeleteCurso} />

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

      {/* CONFIRMACIÓN ELIMINAR CURSO */}
      {confirmDeleteCurso && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-[320px] animate-in fade-in zoom-in-95 duration-200">
            <h4 className="font-semibold text-slate-800 mb-2">¿Eliminar curso?</h4>
            <p className="text-sm text-slate-500 mb-6">
              ¿Estás seguro de que quieres eliminar el curso <strong>{confirmDeleteCurso.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteCurso(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(confirmDeleteCurso.id_curso);
                }}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
