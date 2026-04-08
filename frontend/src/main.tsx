import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import CursosPage from './pages/CursosPage';
import CursoLeadsPage from './pages/CursoLeadsPage';
import LeadDetailPage from './pages/LeadDetailPage';
import AllLeadsPage from './pages/AllLeadsPage';
import './index.css';

// Initialize React Query client with 30s staleTime as requested
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/cursos" replace />} />
            <Route path="cursos" element={<CursosPage />} />
            <Route path="cursos/:id_curso" element={<CursoLeadsPage />} />
            <Route path="cursos/:id_curso/lead/:id_lead" element={<LeadDetailPage />} />
            <Route path="leads" element={<AllLeadsPage />} />
            <Route path="leads/:id_lead" element={<LeadDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
