import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isPending = false,
  variant = 'danger'
}: ConfirmModalProps) {
  
  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    info: "bg-indigo-600 hover:bg-indigo-700 text-white"
  };

  const iconStyles = {
    danger: "text-red-500 bg-red-50",
    warning: "text-amber-500 bg-amber-50",
    info: "text-indigo-500 bg-indigo-50"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${iconStyles[variant]}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            disabled={isPending}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${variantStyles[variant]}`}
            disabled={isPending}
          >
            {isPending ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
