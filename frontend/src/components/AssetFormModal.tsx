import { useState } from 'react';
import type { PhysicalAsset } from '../types/Asset';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PhysicalAsset, 'id'>) => void;
  initialData: PhysicalAsset | null;
}

export default function AssetFormModal({ isOpen, onClose, onSubmit, initialData }: AssetFormModalProps) {
  const [formData, setFormData] = useState({ 
    name: initialData ? initialData.name : '',
    category: initialData ? initialData.category : '',
    condition: initialData ? initialData.condition : 'Unknown',
    location: initialData ? initialData.location : ''
  });

  const [touched, setTouched] = useState({
    name: false,
    category: false
  });

  if (!isOpen) return null;

  const isNameInvalid = touched.name && formData.name.trim() === '';
  const isCategoryInvalid = touched.category && formData.category.trim() === '';

  const hasErrors = isNameInvalid || isCategoryInvalid;

  const isFormValid = formData.name.trim() !== '' && formData.category.trim() !== '';

  const getInputStyles = (isInvalid: boolean) => {
    return `w-full border p-2 rounded transition-colors focus:outline-none focus:ring-2 ${
      isInvalid 
        ? 'border-red-500 bg-red-50 focus:ring-red-200' 
        : 'border-gray-300 bg-white focus:ring-blue-200'
    }`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Asset' : 'Add New Asset'}</h2>

        <div className={`transition-all duration-300 overflow-hidden ${hasErrors ? 'max-h-12 mb-4' : 'max-h-0'}`}>
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            Please fill in all required fields.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <span>Name <span className='text-red-600'>*</span></span>
          <input
            type="text"
            placeholder="Table"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            onBlur={() => setTouched({...touched, name: true})}
            className={getInputStyles(isNameInvalid)}
          />
          <span>Category <span className='text-red-600'>*</span></span>
          <input
            type="text"
            placeholder="Furniture"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            onBlur={() => setTouched({...touched, category: true})}
            className={getInputStyles(isCategoryInvalid)}
          />
          <span>Condition <span className='text-red-600'>*</span></span>
          <select 
            value={formData.condition} 
            onChange={e => setFormData({...formData, condition: e.target.value})} 
            // className="w-full border p-2 rounded bg-white text-gray-700"
            className="w-full border border-gray-300 p-2 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="" disabled>Select Condition</option>
            <option value="Unknown">Unknown</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
          <span>Location</span>
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full border border-gray-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
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