import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";

export interface UserFormData {
  nombre: string;
  email: string;
  username: string;
  rol: 'admin' | 'operador';
  password?: string;
}

interface User {
  id_usuario: number;
  nombre: string;
  email: string;
  username: string;
  rol: 'admin' | 'operador';
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  userToEdit?: User;
  isPending: boolean;
  error?: string | null;
}

export function UserFormModal({ isOpen, onClose, onSubmit, userToEdit, isPending, error }: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    nombre: "",
    email: "",
    username: "",
    rol: "operador",
    password: "",
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nombre: userToEdit.nombre,
        email: userToEdit.email,
        username: userToEdit.username,
        rol: userToEdit.rol,
        password: "",
      });
    } else {
      setFormData({
        nombre: "",
        email: "",
        username: "",
        rol: "operador",
        password: "",
      });
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={userToEdit ? "Editar Usuario" : "Añadir Usuario"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Nombre Completo *</label>
          <input
            type="text"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Username *</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
              placeholder="juan.perez"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Rol *</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50 bg-white"
            >
              <option value="operador">Operador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            {userToEdit ? "Nueva Contraseña (Opcional)" : "Contraseña *"}
          </label>
          <input
            type="password"
            name="password"
            required={!userToEdit}
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
            placeholder={userToEdit ? "Dejar en blanco para no cambiar" : "••••••••"}
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-accent-from to-accent-to rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

