import { Plus } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
}

export default function Header({ onAddClick }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Classroom Equipment Tracker</h1>
      <button 
        onClick={onAddClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer flex items-center gap-2"
      >
        <Plus size={20} />
        Add new asset
      </button>
    </div>
  );
}