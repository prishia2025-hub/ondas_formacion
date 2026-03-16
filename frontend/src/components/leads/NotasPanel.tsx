import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Plus, X } from 'lucide-react';
import { createNota, type Nota, type NotaFormData } from '@/api/notas';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '../ui/SkeletonCard';

interface NotasPanelProps {
  leadId: number;
  notas?: Nota[];
  isLoading: boolean;
  cursoId?: number; // Optional context if we're in a course
}

export function NotasPanel({ leadId, notas, isLoading, cursoId }: NotasPanelProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<NotaFormData, 'id_lead'>>({
    titulo: '',
    contenido: '',
    id_curso: cursoId,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<NotaFormData, 'id_lead'>) => createNota(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas', leadId] });
      setIsOpen(false);
      setFormData({ titulo: '', contenido: '', id_curso: cursoId });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contenido.trim()) return;
    createMutation.mutate(formData);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden h-full flex flex-col pt-2 shadow-sm">
      <div className="px-5 pb-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">📝</span>
          Notas y Seguimiento
        </h3>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-accent-from hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100 font-medium text-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Añadir Nota
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto bg-slate-50/50">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : notas && notas.length > 0 ? (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {notas.map((nota) => (
              <div key={nota.id_nota} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <span className="w-2.5 h-2.5 bg-accent-from rounded-full" />
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{nota.titulo || 'Nota'}</span>
                    <span className="text-xs text-slate-500 font-medium">{formatDate(nota.fecha)}</span>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{nota.contenido}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">No hay notas registradas para este lead.</p>
          </div>
        )}
      </div>

      {/* FIXED OVERLAY FOR NEW NOTA */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
            <h4 className="font-semibold">Nueva Nota</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Título (opcional)"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full text-sm font-medium border-b border-slate-200 pb-2 focus:outline-none focus:border-accent-from placeholder:text-slate-400"
              />
            </div>
            <div>
              <textarea
                required
                placeholder="Escribe los detalles del seguimiento..."
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                className="w-full text-sm min-h-[120px] resize-none focus:outline-none placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <div className="pt-2 border-t flex justify-end">
              <button
                type="submit"
                disabled={createMutation.isPending || !formData.contenido.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-from to-accent-to text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {createMutation.isPending ? 'Enviando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
