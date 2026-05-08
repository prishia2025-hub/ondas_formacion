import { Outlet, NavLink } from 'react-router-dom';
import Header from './Header';
import { BookOpen, Users } from 'lucide-react';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1 min-h-0">

        {/* ── SIDEBAR ── */}
        <aside className="w-52 shrink-0 border-r border-slate-200 bg-white">
          <nav className="p-3 pt-4">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/cursos"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <BookOpen size={16} />
                  Cursos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/leads"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Users size={16} />
                  Leads
                </NavLink>
              </li>
              
              <li className="my-2 border-t border-slate-200"></li>
              
              <li>
                <NavLink
                  to="/usuarios"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Users size={16} />
                  Usuarios
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


