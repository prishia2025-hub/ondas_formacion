interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ page, totalPages, onPageChange, isLoading }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">

      {/* Anterior */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isLoading}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
      >
        ← Anterior
      </button>

      {/* Select de página */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Página</span>
        <select
          value={page}
          onChange={(e) => onPageChange(Number(e.target.value))}
          disabled={isLoading}
          className="px-2 py-1.5 text-sm font-medium text-slate-700 bg-white border border-border rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-40"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <span>de {totalPages}</span>
      </div>

      {/* Siguiente */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || isLoading}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-border rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
      >
        Siguiente →
      </button>

    </div>
  );
}