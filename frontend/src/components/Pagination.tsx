import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  return (
    <div className="flex justify-center gap-4 items-center mt-6">
      <button 
        data-testid="prev-button"
        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
        disabled={page === 0}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-gray-600 font-medium">
        Page {page + 1} of {totalPages === 0 ? 1 : totalPages}
      </span>
      <button
        data-testid="next-button"
        onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
        disabled={page >= totalPages - 1 || totalPages === 0}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}