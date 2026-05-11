import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMe, updateMe, type UserFormData } from '@/api/users';
import { User, Mail, Shield, AtSign, Lock, Save, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/SkeletonCard';

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetchMe(token),
    enabled: !!token,
  });

  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    email: '',
    username: '',
    rol: 'operador',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        username: user.username,
        rol: user.rol,
        password: '', // Password field stays empty unless user wants to change it
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserFormData>) => updateMe(data, token),
    onSuccess: (_, variables) => {
      // If password was changed, logout for security
      if (variables.password) {
        logout();
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData(prev => ({ ...prev, password: '' }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToUpdate: any = {
      nombre: formData.nombre,
      email: formData.email,
    };
    if (formData.password) {
      dataToUpdate.password = formData.password;
    }
    updateMutation.mutate(dataToUpdate);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Configuración de Perfil</h1>
        <p className="text-sm text-slate-500 mt-1">Gestiona tu información personal y seguridad.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border bg-slate-50/50">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.nombre}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  {user?.rol === 'admin' ? 'Administrador' : 'Operador'}
                </span>
                <span className="text-xs text-slate-400 font-mono">@{user?.username}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {updateMutation.error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {(updateMutation.error as Error).message}
            </div>
          )}

          {success && (
            <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4" />
              Perfil actualizado correctamente.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-slate-300" /> Username (No editable)
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.username}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400" /> Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para mantener actual"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Mínimo 8 caracteres para mayor seguridad.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-from to-accent-to text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
