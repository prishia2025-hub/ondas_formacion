import { NavLink } from 'react-router-dom';
import { BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar({ className }: { className?: string }) {
  const routes = [
    { name: 'Cursos', path: '/cursos', icon: BookOpen },
    { name: 'Leads', path: '/leads', icon: Users },
  ];

  return (
    <aside className={cn("h-full py-6 flex flex-col gap-2 px-3 shadow-[1px_0_3px_rgba(0,0,0,0.05)]", className)}>
      <nav className="flex-1 space-y-1">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive 
                ? "bg-gradient-to-r from-indigo-50 to-sky-50 text-accent-from shadow-sm"
                : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
            )}
          >
            <route.icon className="w-5 h-5" />
            {route.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
