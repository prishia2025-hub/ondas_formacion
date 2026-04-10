import { useState, useEffect } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ page, totalPages, onPageChange, isLoading }: PaginationProps) {
  const [inputValue, setInputValue] = useState(String(page));

  // Sincroniza el input si la página cambia desde fuera
  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  const handleJump = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      onPageChange(parsed);
    } else {
      // Valor inválido → resetea al valor actual
      setInputValue(String(page));
    }
  };

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

      {/* Input de página */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Página</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleJump}
          onKeyDown={(e) => e.key === 'Enter' && handleJump()}
          disabled={isLoading}
          className="w-14 px-2 py-1.5 text-sm font-medium text-center text-slate-700 bg-white border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
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