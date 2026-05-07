import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel: Gradient and Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-cyan-500 items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Ondas Formación</h1>
          <p className="text-xl text-indigo-50/90 leading-relaxed font-light">
            Gestión inteligente de leads y formación avanzada. Impulsando el futuro del aprendizaje.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-app">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-card border border-border">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Bienvenido de nuevo</h2>
            <p className="text-text-secondary">Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                placeholder="nombre.apellido"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:ring-4 focus:ring-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-text-secondary">
              ¿Problemas para acceder? Contacta con el administrador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
