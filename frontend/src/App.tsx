import { useState, useEffect, useCallback } from 'react';
import type { PhysicalAsset } from './types/Asset';
import AssetTable from './components/AssetTable';
import AssetFormModal from './components/AssetFormModal';
import ConfirmModal from './components/ConfirmModal';
import { Plus, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [assets, setAssets] = useState<PhysicalAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination's Pages
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentAsset, setCurrentAsset] = useState<PhysicalAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAssets = useCallback(() => {
    let url = `http://localhost:8080/api/assets?page=${page}&size=10`;
    if (searchTerm.trim() !== "") {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAssets(data.content); 
        setTotalPages(data.totalPages);
        setLoading(false);
      });
  }, [page, searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchAssets();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [fetchAssets]);

  // API Handlers
  const handleSaveAsset = (formData: Omit<PhysicalAsset, 'id'>) => {
    const isEditing = currentAsset !== null;
    const url = isEditing ? `http://localhost:8080/api/assets/${currentAsset.id}` : 'http://localhost:8080/api/assets';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then((response) => {
      if (!response.ok) throw new Error('Failed to save the asset.');
      return response.json();
    })
    .then(() => {
      fetchAssets();
      setIsFormModalOpen(false);
      toast.success(isEditing ? 'Asset updated successfully!' : 'Asset added successfully!');
    })
    .catch((error) => {
      toast.error(error.message || 'An error occurred while saving.');
    });
  };

  const handleConfirmDelete = () => {
    if (assetToDelete === null) return;

    fetch(`http://localhost:8080/api/assets/${assetToDelete}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete the asset.');
      })
      .then(() => {
        fetchAssets();
        setIsDeleteModalOpen(false);
        toast.success('Asset deleted successfully!');
      })
      .catch((error) => {
        toast.error(error.message || 'An error occurred while deleting.');
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-lg">Loading equipment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" reverseOrder={false} toastOptions={{duration: 2000}}/>

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Classroom Equipment Tracker</h1>
          <button 
            onClick={() => { setCurrentAsset(null); setIsFormModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer flex items-center gap-2"
          >
            <Plus size={20} />
            Add new asset
          </button>
        </div>

        <div className="relative mb-6 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search by Name, Category, or Location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <AssetTable 
          assets={assets} 
          onEdit={(asset) => { setCurrentAsset(asset); setIsFormModalOpen(true); }} 
          onDelete={(id) => { setAssetToDelete(id); setIsDeleteModalOpen(true); }} 
        />
      </div>

      <div className="flex justify-center gap-4 items-center mt-6">
        <button 
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
          onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
          disabled={page >= totalPages - 1 || totalPages === 0}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {isFormModalOpen && (
        <AssetFormModal 
          key={currentAsset ? currentAsset.id : 'new-asset'} 
          isOpen={isFormModalOpen} 
          onClose={() => setIsFormModalOpen(false)} 
          onSubmit={handleSaveAsset} 
          initialData={currentAsset} 
        />
      )}

      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this asset? This action cannot be undone."
      />
    </div>
  );
}