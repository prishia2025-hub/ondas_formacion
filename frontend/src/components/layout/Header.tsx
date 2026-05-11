import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[64px] bg-white border-b relative flex items-center justify-between px-6 z-10 flex-shrink-0">
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-from to-accent-to" />

      <div className="flex items-center gap-3">
        {/* Logo text with gradient */}
        <Link
          to="/cursos"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Ondas Formación
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-text-primary leading-none">{user.nombre}</span>
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold mt-1 bg-slate-100 px-1.5 py-0.5 rounded">{user.rol}</span>
          </div>
        )}
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors focus:outline-none border border-border"
          >
            <User className="w-5 h-5 text-text-secondary" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-border animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              <div className="px-4 py-2 border-b border-border md:hidden">
                <p className="text-sm font-semibold text-text-primary">{user?.nombre}</p>
                <p className="text-xs text-text-secondary uppercase">{user?.rol}</p>
              </div>
              <Link 
                to="/perfil"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-slate-50 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> Configuración
              </Link>

              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

