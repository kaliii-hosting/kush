import { Edit2, Trash2, Package } from 'lucide-react';

const ProductList = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <Package className="w-16 h-16 text-gray-600 mx-auto mb-2" />
        <p className="text-gray-400 text-lg">No products found</p>
        <p className="text-gray-500 text-sm">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-1.5">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 rounded-lg p-2">
            <div className="flex items-start gap-1.5 mb-1.5">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{product.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 mb-1.5 text-sm">
              <div>
                <span className="text-gray-400">Category:</span>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  product.category === 'flower' 
                    ? 'bg-green-500/20 text-green-400' 
                    : product.category === 'edible'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {product.category}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Price:</span>
                <span className="ml-2 text-white font-medium">${product.price}</span>
              </div>
              <div>
                <span className="text-gray-400">THC:</span>
                <span className="ml-2 text-white">{product.thc}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  product.inStock 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end gap-1">
              <button
                onClick={() => onEdit(product)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                THC
              </th>
              <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-1.5 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {product.description?.substring(0, 60)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.category === 'flower' 
                      ? 'bg-green-500/20 text-green-400' 
                      : product.category === 'edible'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.thc}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.inStock 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default ProductList;