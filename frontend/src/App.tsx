import { useState, useEffect, useCallback } from 'react';
import type { PhysicalAsset } from './types/Asset';
import AssetTable from './components/AssetTable';
import AssetFormModal from './components/AssetFormModal';
import ConfirmModal from './components/ConfirmModal';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [assets, setAssets] = useState<PhysicalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
    .catch((error) => toast.error(error.message || 'An error occurred while saving.'));
  };

  const handleConfirmDelete = () => {
    if (assetToDelete === null) return;

    fetch(`http://localhost:8080/api/assets/${assetToDelete}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete the asset.');
      })
      .then(() => {
        if (assets.length === 1 && page > 0) {
          setPage((prev) => prev - 1);
        } else {
          fetchAssets();
        }

        setIsDeleteModalOpen(false);
        toast.success('Asset deleted successfully!');
      })
      .catch((error) => toast.error(error.message || 'An error occurred while deleting.'));
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
        <Header onAddClick={() => { setCurrentAsset(null); setIsFormModalOpen(true); }} />
        
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={(value) => { setSearchTerm(value); setPage(0); }} 
        />

        <AssetTable 
          assets={assets} 
          onEdit={(asset) => { setCurrentAsset(asset); setIsFormModalOpen(true); }} 
          onDelete={(id) => { setAssetToDelete(id); setIsDeleteModalOpen(true); }} 
        />
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

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