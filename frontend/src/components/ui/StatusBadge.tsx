import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      status: {
        "Nuevo": "bg-status-nuevo-bg text-status-nuevo-text",
        "Contactado": "bg-status-contactado-bg text-status-contactado-text",
        "Pendiente de documentación": "bg-status-ptedoc-bg text-status-ptedoc-text",
        "Inscrito": "bg-status-inscrito-bg text-status-inscrito-text",
        "Reserva": "bg-status-reserva-bg text-status-reserva-text",
        "No interesado": "bg-status-nointeresado-bg text-status-nointeresado-text",
      },
      estadoCurso: {
        activo: "bg-green-100 text-green-700",
        lleno: "bg-orange-100 text-orange-700",
        inactivo: "bg-slate-100 text-slate-600",
      }
    },
  }
)

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statusVariants> {
  label: string;
}

export function StatusBadge({ className, status, estadoCurso, label, ...props }: StatusBadgeProps) {
  // Try to match the status string if valid, else fallback to default style
  let matchedStatus = status;
  if (status && !['Nuevo', 'Contactado', 'Pendiente de documentación', 'Inscrito', 'Reserva', 'No interesado'].includes(status)) {
    matchedStatus = null;
  }

  return (
    <div className={cn(statusVariants({ status: matchedStatus, estadoCurso }), className)} {...props}>
      {label}
    </div>
  )
}
