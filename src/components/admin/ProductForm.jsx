import { useState } from 'react';
import { X } from 'lucide-react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    type: product?.type || 'flower',
    price: product?.price || '',
    thc: product?.thc || '',
    description: product?.description || '',
    effects: product?.effects ? product.effects.join(', ') : '',
    imageUrl: product?.imageUrl || '',
    inStock: product?.inStock !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      effects: formData.effects.split(',').map(effect => effect.trim()).filter(effect => effect),
      inStock: formData.inStock // Ensure inStock is included
    };

    console.log('ProductForm: Submitting product data:', productData);
    onSubmit(productData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="flower">Flower</option>
              <option value="edible">Edible</option>
              <option value="concentrate">Concentrate</option>
              <option value="cartridge">Cartridges</option>
              <option value="disposable">Disposables</option>
              <option value="pod">Pods</option>
              <option value="battery">Batteries</option>
              <option value="infused-preroll">Infused Prerolls</option>
              <option value="preroll">Prerolls</option>
              <option value="merch">Merch</option>
              <option value="distillate">Distillate</option>
              <option value="liquid-diamonds">Liquid Diamonds</option>
              <option value="live-resin-diamonds">Live Resin Diamonds</option>
              <option value="hash-infused-preroll">Hash Infused Prerolls</option>
              <option value="infused-preroll-5pack">Infused Prerolls - 5 Pack</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              THC Content
            </label>
            <input
              type="text"
              name="thc"
              value={formData.thc}
              onChange={handleChange}
              placeholder="e.g., 22% or 10mg"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Effects (comma-separated)
            </label>
            <input
              type="text"
              name="effects"
              value={formData.effects}
              onChange={handleChange}
              placeholder="e.g., Relaxed, Happy, Euphoric"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/product.png"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Use transparent PNG images for best results in 3D display
            </p>
            {formData.imageUrl && (
              <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                <img 
                  src={formData.imageUrl} 
                  alt="Product preview" 
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
            />
            <label className="ml-2 text-sm text-gray-300">
              In Stock
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;