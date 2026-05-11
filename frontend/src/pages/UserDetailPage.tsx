import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Mail, User, Shield, AtSign } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { UserFormModal } from '@/components/users/UserFormModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUser, updateUser, type UserFormData } from '@/api/users';
import { Skeleton } from '@/components/ui/SkeletonCard';

export default function UserDetailPage() {
  const { id_usuario } = useParams<{ id_usuario: string }>();
  const { user: currentUser, token } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();
  const userId = Number(id_usuario);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId, token),
    enabled: !!userId && !!token,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => updateUser(userId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditOpen(false);
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center text-slate-500">Usuario no encontrado.</div>;
  }

  const backLink = '/usuarios';
  const backText = 'Volver a Usuarios';

  return (
    <div className="max-w-3xl mx-auto h-full min-h-0 flex flex-col p-6">
      {/* Volver */}
      <div className="mb-6 flex items-center gap-2 text-sm shrink-0">
        <Link to={backLink} className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {backText}
        </Link>
      </div>

      {/* Card de Detalle */}
      <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.nombre}</h1>
              <span className={`text-xs uppercase font-bold px-2 py-1 rounded inline-flex items-center gap-1.5 ${
                user.rol === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
              }`}>
                <Shield className="w-3 h-3" />
                {user.rol === 'admin' ? 'Administrador' : 'Operador'}
              </span>
            </div>
          </div>
          {currentUser?.rol === 'admin' && (
            <button 
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              ✏️ Editar Usuario
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <AtSign className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Username</p>
                <p className="font-semibold text-slate-900">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</p>
                <p className="font-semibold text-slate-900">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userToEdit={user}
        onSubmit={(data) => updateMutation.mutate(data)}
        isPending={updateMutation.isPending}
        error={(updateMutation.error as Error)?.message}
      />
    </div>
  );
}


