import { Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '../ui/SkeletonCard';
import { useNavigate } from 'react-router-dom';

interface User {
  id_usuario: number;
  username: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'operador';
}

interface AllUsersTableProps {
  users?: User[];
  isLoading: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function AllUsersTable({ users, isLoading, onEdit, onDelete }: AllUsersTableProps) {
  const navigate = useNavigate();

  if (isLoading) return <Skeleton />;

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="font-semibold text-slate-700">No hay usuarios</h3>
        <p className="text-sm text-slate-500 mt-1">Añade tu primer usuario para empezar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Username</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Rol</th>
              <th className="text-center px-4 py-3 font-medium text-slate-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr
                key={user.id_usuario}
                onClick={() => navigate(`/usuarios/${user.id_usuario}`)}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
              >

                <td className="px-4 py-3 font-medium text-slate-800">{user.username}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.nombre}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.rol === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.rol === 'admin' ? 'Administrador' : 'Operador'}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">

                    <button
                      onClick={() => onEdit?.(user)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {user.rol !== 'admin' && (
                      <button
                        onClick={() => onDelete?.(user)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
