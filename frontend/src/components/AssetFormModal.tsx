import { useState } from 'react';
import type { PhysicalAsset } from '../types/Asset';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PhysicalAsset, 'id'>) => void;
  initialData: PhysicalAsset | null;
}

export default function AssetFormModal({ isOpen, onClose, onSubmit, initialData }: AssetFormModalProps) {
  // Initialize the state directly from the props
  const [formData, setFormData] = useState({ 
    name: initialData ? initialData.name : '', 
    category: initialData ? initialData.category : '', 
    condition: initialData ? initialData.condition : '', 
    location: initialData ? initialData.location : '' 
  });

  if (!isOpen) return null;

  const isFormValid = formData.name.trim() !== '' && formData.category.trim() !== '' && formData.condition.trim() !== '' && formData.location.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Asset' : 'Add New Asset'}</h2>

        <div className="space-y-4 mb-6">
          <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded" />
          <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border p-2 rounded" />
          <input type="text" placeholder="Condition" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full border p-2 rounded" />
          <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border p-2 rounded" />
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">Cancel</button>
          <button 
            onClick={() => onSubmit(formData)} 
            disabled={!isFormValid}
            className={`px-4 py-2 rounded font-medium text-white ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'}`}
          >
            {initialData ? 'Edit the asset' : 'Add an asset'}
          </button>
        </div>
      </div>
    </div>
  );
}