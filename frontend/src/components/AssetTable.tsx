import type { PhysicalAsset } from '../types/Asset';

interface AssetTableProps {
  assets: PhysicalAsset[];
  onEdit: (asset: PhysicalAsset) => void;
  onDelete: (id: number) => void;
}

export default function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-200">
            <th className="p-4 font-semibold text-gray-700">ID</th>
            <th className="p-4 font-semibold text-gray-700">Name</th>
            <th className="p-4 font-semibold text-gray-700">Category</th>
            <th className="p-4 font-semibold text-gray-700">Condition</th>
            <th className="p-4 font-semibold text-gray-700">Location</th>
            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">No equipment found.</td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr key={asset.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-600">{asset.id}</td>
                <td className="p-4 font-medium text-gray-900">{asset.name}</td>
                <td className="p-4 text-gray-600">{asset.category}</td>
                <td className="p-4 text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${asset.condition === 'New' ? 'bg-green-100 text-green-800' : 
                      asset.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {asset.condition}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{asset.location}</td>
                <td className="p-4 space-x-2 text-right">
                  <button onClick={() => onEdit(asset)} className="text-blue-600 hover:underline font-medium cursor-pointer">Edit</button>
                  <button onClick={() => onDelete(asset.id)} className="text-red-600 hover:underline font-medium cursor-pointer">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}