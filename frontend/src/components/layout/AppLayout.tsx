import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-app">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar className="w-[220px] flex-shrink-0 border-r bg-sidebar md:flex hidden" />
        <main className="flex-1 overflow-auto bg-app relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
