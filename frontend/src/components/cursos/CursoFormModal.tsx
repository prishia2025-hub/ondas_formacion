import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import type { Curso, CursoFormData } from "@/api/cursos";

interface CursoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CursoFormData) => void;
  cursoToEdit?: Curso;
  isPending: boolean;
}

export function CursoFormModal({ isOpen, onClose, onSubmit, cursoToEdit, isPending }: CursoFormModalProps) {
  const [formData, setFormData] = useState<CursoFormData>({
    nombre: "",
    codigo: "",
    max_alumnos: undefined,
    fecha_inicio: "",
    fecha_fin: "",
    activo: true,
    lleno: false,
    para_trabajadores: false,
    horas_totales: undefined,
    horario: "",
  });

  useEffect(() => {
    if (cursoToEdit) {
      setFormData({
        nombre: cursoToEdit.nombre,
        codigo: cursoToEdit.codigo || "",
        max_alumnos: cursoToEdit.max_alumnos,
        fecha_inicio: cursoToEdit.fecha_inicio || "",
        fecha_fin: cursoToEdit.fecha_fin || "",
        activo: cursoToEdit.activo,
        lleno: cursoToEdit.lleno,
        para_trabajadores: cursoToEdit.para_trabajadores || false,
        horas_totales: cursoToEdit.horas_totales,
        horario: cursoToEdit.horario || "",
      });
    } else {
      setFormData({
        nombre: "",
        codigo: "",
        max_alumnos: undefined,
        fecha_inicio: "",
        fecha_fin: "",
        activo: true,
        lleno: false,
        para_trabajadores: false,
        horas_totales: undefined,
        horario: "",
      });
    }
  }, [cursoToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? (value ? Number(value) : undefined) : value),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={cursoToEdit ? "Editar Curso" : "Nuevo Curso"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Nombre del curso *</label>
          <input
            type="text"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
            placeholder="Ej. Diseño Gráfico Avanzado"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Código</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
              placeholder="Ej. DG-2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Max Alumnos</label>
            <input
              type="number"
              name="max_alumnos"
              value={formData.max_alumnos || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
              placeholder="Ej. 25"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Fecha Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Fecha Fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Horas Totales</label>
            <input
              type="number"
              name="horas_totales"
              value={formData.horas_totales || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
              placeholder="Ej. 120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Horario</label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-from/50"
              placeholder="Ej. Lunes y Miércoles 18:00"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="rounded text-accent-from focus:ring-accent-from/50"
            />
            <span className="text-sm font-medium">¿Curso ACTIVO?</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="lleno"
              checked={formData.lleno}
              onChange={handleChange}
              className="rounded text-accent-from focus:ring-accent-from/50"
            />
            <span className="text-sm font-medium text-orange-600">¿Curso LLENO?</span>
          </label>
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
