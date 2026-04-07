import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { fetchStatuses } from '@/api/statuses';

interface CursoEstadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (estado: string) => void;
  initialEstado: string;
  isPending: boolean;
  error?: string | null;
}

export function CursoEstadoModal({
  isOpen,
  onClose,
  onSubmit,
  initialEstado,
  isPending,
  error,
}: CursoEstadoModalProps) {
  const { data: statuses, isLoading: isStatusesLoading } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
    staleTime: Infinity,
  });

  const [estado, setEstado] = useState(initialEstado);

  useEffect(() => {
    if (isOpen) {
      setEstado(initialEstado);
    }
  }, [isOpen, initialEstado]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(estado);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar estado del curso">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Estado
          </label>
          <select
            name="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50 bg-white"
          >
            {isStatusesLoading && <option value="">Cargando...</option>}
            {statuses?.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-accent-from to-accent-to rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}