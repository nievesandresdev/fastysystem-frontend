type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const maxVisible = 5 // cantidad fija de botones visibles
  const pages: (number | string)[] = []

  if (totalPages <= maxVisible) {
    // Caso simple: menos de 5 páginas → se muestran todas
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (page <= 3) {
      // Cerca del inicio → fijo 1..3 + ... + última
      pages.push(1, 2, 3, "...", totalPages)
    } else if (page >= totalPages - 2) {
      // Cerca del final → primera + ... + últimas 3
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
    } else {
      // En el medio → primera + ... + actual + ... + última
      pages.push(1, "...", page, "...", totalPages)
    }
  }

  return (
    <div className="pagination flex justify-center items-center gap-2 py-3">
      {/* Botón Anterior */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 bg-gray-200 hover-bg-gray-2 shadow rounded disabled:opacity-50 cursor-pointer"
      >
        Anterior
      </button>

      {/* Números de página */}
      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded cursor-pointer shadow ${
              p === page
                ? "bg-green-500 text-white font-bold"
                : "bg-gray-200 hover-bg-gray-2"
            }`}
          >
            {p}
          </button>
        ) : (
          <span
            key={idx}
            className="px-3 py-1 text-gray-500 select-none"
          >
            {p}
          </span>
        )
      )}

      {/* Botón Siguiente */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 bg-gray-200 hover-bg-gray-2 shadow rounded disabled:opacity-50 cursor-pointer"
      >
        Siguiente
      </button>
    </div>
  )
}
