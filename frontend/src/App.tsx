import { useState, useEffect } from 'react';
import type { PhysicalAsset } from './types/Asset';
import AssetTable from './components/AssetTable';
import AssetFormModal from './components/AssetFormModal';
import ConfirmModal from './components/ConfirmModal';

export default function App() {
  const [assets, setAssets] = useState<PhysicalAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<PhysicalAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);

  const fetchAssets = () => {
    fetch('http://localhost:8080/api/assets')
      .then(res => res.json())
      .then(data => { setAssets(data); setLoading(false); });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // API Handlers
  const handleSaveAsset = (formData: Omit<PhysicalAsset, 'id'>) => {
    const isEditing = currentAsset !== null;
    const url = isEditing ? `http://localhost:8080/api/assets/${currentAsset.id}` : 'http://localhost:8080/api/assets';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      fetchAssets();
      setIsFormModalOpen(false);
    });
  };

  const handleConfirmDelete = () => {
    if (assetToDelete === null) return;
    fetch(`http://localhost:8080/api/assets/${assetToDelete}`, { method: 'DELETE' })
      .then(() => {
        fetchAssets();
        setIsDeleteModalOpen(false);
      });
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Classroom Equipment Tracker</h1>
          <button 
            onClick={() => { setCurrentAsset(null); setIsFormModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
          >
            Add new asset
          </button>
        </div>

        <AssetTable 
          assets={assets} 
          onEdit={(asset) => { setCurrentAsset(asset); setIsFormModalOpen(true); }} 
          onDelete={(id) => { setAssetToDelete(id); setIsDeleteModalOpen(true); }} 
        />
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