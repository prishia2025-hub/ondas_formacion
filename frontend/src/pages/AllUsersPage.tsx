import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { AllUsersTable } from '@/components/users/AllUsersTable';
import { Pagination } from '@/components/ui/Pagination';
import { UserFormModal } from '@/components/users/UserFormModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

// Mock data for visual purposes
const MOCK_USERS = [
  { id_usuario: 1, username: 'admin', email: 'admin@ondasformacion.com', nombre: 'Admin Sistema', rol: 'admin' as const },
  { id_usuario: 2, username: 'juan.perez', email: 'juan@example.com', nombre: 'Juan Pérez', rol: 'operador' as const },
  { id_usuario: 3, username: 'maria.garcia', email: 'maria@example.com', nombre: 'María García', rol: 'operador' as const },
];

export default function AllUsersPage() {
  const [search, setSearch] = useState('');
  const [rolFilter, setRolFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);
  const [totalUsers] = useState(MOCK_USERS.length);
  const [isLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any>(undefined);
  const [userToDelete, setUserToDelete] = useState<any>(undefined);

  const handleEdit = (user: any) => {
    setUserToEdit(user);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };


  return (
    <div className="space-y-6 p-6">
      {/* Título */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
        <p className="text-sm text-slate-500 mt-1">{totalUsers} usuarios totales</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por username o nombre..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Filtro Rol */}
        <select
          value={rolFilter}
          onChange={(e) => { setRolFilter(e.target.value); setPage(1); }}
          className="py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700"
        >
          <option value="Todos">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="operador">Operador</option>
        </select>

        {/* Botón Añadir */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-accent-from to-accent-to rounded-lg hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Añadir Usuario
        </button>
      </div>

      {/* Tabla */}
      <AllUsersTable
        users={MOCK_USERS}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />



      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            isLoading={isLoading}
          />
        </div>
      )}

      <UserFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(data) => { console.log('Create User', data); setIsAddOpen(false); }}
        isPending={false}
      />

      <UserFormModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setUserToEdit(undefined); }}
        userToEdit={userToEdit}
        onSubmit={(data) => { console.log('Update User', data); setIsEditOpen(false); }}
        isPending={false}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setUserToDelete(undefined); }}
        onConfirm={() => { console.log('Deleting user', userToDelete); setIsDeleteOpen(false); }}
        title="Eliminar Usuario"
        description={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}


