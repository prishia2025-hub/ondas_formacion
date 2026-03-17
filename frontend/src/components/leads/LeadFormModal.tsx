import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import type { Lead, LeadFormData } from "@/api/leads";
import { useQuery } from "@tanstack/react-query";
import { fetchStatuses } from "@/api/statuses";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  leadToEdit?: Lead;
  isPending: boolean;
}

export function LeadFormModal({ isOpen, onClose, onSubmit, leadToEdit, isPending }: LeadFormModalProps) {
  const { data: statuses } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
    staleTime: Infinity,
  });

  const [formData, setFormData] = useState<LeadFormData>({
    nombre: "",
    telefono: "",
    mail: "",
    trabajador: false,
    estado: "Nuevo",
    nota_inicial: "",
  });

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        nombre: leadToEdit.nombre,
        telefono: leadToEdit.telefono || "",
        mail: leadToEdit.mail || "",
        trabajador: leadToEdit.trabajador || false,
        estado: leadToEdit.estado || "Nuevo",
        nota_inicial: "", // only for creation really but we keep it
      });
    } else {
      setFormData({
        nombre: "",
        telefono: "",
        mail: "",
        trabajador: false,
        estado: "Nuevo",
        nota_inicial: "",
      });
    }
  }, [leadToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === "checkbox" ? e.target.checked : undefined;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={leadToEdit ? "Editar Lead" : "Añadir Lead"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Nombre *</label>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
              placeholder="+34 600..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
              placeholder="juan@ejemplo.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50 bg-white"
          >
            {statuses?.map(s => <option key={s} value={s}>{s}</option>)}
            {!statuses && <option value="Nuevo">Nuevo</option>}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              name="trabajador"
              checked={formData.trabajador}
              onChange={handleChange}
              className="rounded text-accent-from focus:ring-accent-from/50"
            />
            <span className="text-sm font-medium">¿Está trabajando?</span>
          </label>
        </div>

        {!leadToEdit && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1 mt-2">Nota inicial (Opcional)</label>
            <textarea
              name="nota_inicial"
              value={formData.nota_inicial}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50 resize-none"
              placeholder="Detalles sobre su interés..."
            />
          </div>
        )}

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
