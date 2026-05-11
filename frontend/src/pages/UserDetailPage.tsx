import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Mail, User, Shield, AtSign } from 'lucide-react';
import { useAuth } from '@/lib/auth';

// Mock user data for visual purposes
const MOCK_USER = {
  id_usuario: 1,
  username: 'admin',
  email: 'admin@ondasformacion.com',
  nombre: 'Admin Sistema',
  rol: 'admin' as const,
};

export default function UserDetailPage() {
  const { id_usuario } = useParams<{ id_usuario: string }>();
  const { user: currentUser } = useAuth();

  // For visual purposes, we use the mock user
  const user = MOCK_USER;

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
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
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

          <div className="space-y-4">
             {/* Espacio para más campos en el futuro */}
             <div className="p-4 bg-indigo-50/30 rounded-lg border border-indigo-100/50 flex flex-col justify-center items-center text-center h-full min-h-[140px]">
                <Shield className="w-8 h-8 text-indigo-200 mb-2" />
                <p className="text-sm text-indigo-400 font-medium italic">Configuración de seguridad y permisos próximamente</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
