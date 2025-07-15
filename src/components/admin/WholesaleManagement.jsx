import { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import { Plus, Edit2, Trash2, Package, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const WholesaleManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'flower',
    wholesalePrice: '',
    bulkPricing: [],
    description: '',
    thc: '',
    cbd: '',
    strain: '',
    imageUrl: '',
    inStock: true,
    stockQuantity: ''
  });

  // Fetch wholesale products from Firebase
  useEffect(() => {
    const fetchProducts = () => {
      try {
        const productsRef = ref(realtimeDb, 'wholesale_products');
        const unsubscribe = onValue(productsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const productsArray = Object.entries(data).map(([id, product]) => ({
              id,
              ...product
            }));
            setProducts(productsArray);
          } else {
            setProducts([]);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching wholesale products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      wholesalePrice: parseFloat(formData.wholesalePrice),
      stockQuantity: parseInt(formData.stockQuantity),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingProduct) {
        // Update existing product
        const productRef = ref(realtimeDb, `wholesale_products/${editingProduct.id}`);
        await update(productRef, productData);
      } else {
        // Add new product
        const productsRef = ref(realtimeDb, 'wholesale_products');
        await push(productsRef, {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }

      resetForm();
      // Close form after successful save
      if (!editingProduct) {
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = ref(realtimeDb, `wholesale_products/${productId}`);
        await remove(productRef);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || 'flower',
      wholesalePrice: product.wholesalePrice || '',
      bulkPricing: product.bulkPricing || [],
      description: product.description || '',
      thc: product.thc || '',
      cbd: product.cbd || '',
      strain: product.strain || '',
      imageUrl: product.imageUrl || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      stockQuantity: product.stockQuantity || ''
    });
    // Show form and scroll to top
    setShowForm(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: 'flower',
      wholesalePrice: '',
      bulkPricing: [],
      description: '',
      thc: '',
      cbd: '',
      strain: '',
      imageUrl: '',
      inStock: true,
      stockQuantity: ''
    });
    setEditingProduct(null);
  };

  // Add bulk pricing tier
  const addBulkPricingTier = () => {
    setFormData({
      ...formData,
      bulkPricing: [...formData.bulkPricing, { quantity: '', price: '' }]
    });
  };

  // Update bulk pricing tier
  const updateBulkPricingTier = (index, field, value) => {
    const updatedPricing = [...formData.bulkPricing];
    updatedPricing[index][field] = value;
    setFormData({ ...formData, bulkPricing: updatedPricing });
  };

  // Remove bulk pricing tier
  const removeBulkPricingTier = (index) => {
    const updatedPricing = formData.bulkPricing.filter((_, i) => i !== index);
    setFormData({ ...formData, bulkPricing: updatedPricing });
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'flower', 'pre-roll', 'edible', 'concentrate', 'topical', 'accessory'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading wholesale products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Product Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Wholesale Products</h2>
          <p className="text-gray-400 mt-1">Manage your wholesale inventory and pricing</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-spotify-green hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
          {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsible Form Section */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        showForm ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-spotify-light-gray rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-full lg:col-span-2">
            <label className="block text-gray-400 mb-2">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            >
              <option value="flower">Flower</option>
              <option value="pre-roll">Pre-Roll</option>
              <option value="edible">Edible</option>
              <option value="concentrate">Concentrate</option>
              <option value="topical">Topical</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Wholesale Price</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.wholesalePrice}
              onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
              className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Strain</label>
            <input
              type="text"
              value={formData.strain}
              onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
              className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>
          
          <div>
              <label className="block text-gray-400 mb-2">THC %</label>
              <input
                type="text"
                value={formData.thc}
                onChange={(e) => setFormData({ ...formData, thc: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">CBD %</label>
              <input
                type="text"
                value={formData.cbd}
                onChange={(e) => setFormData({ ...formData, cbd: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Stock</label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>

          {/* Bulk Pricing */}
          <div className="col-span-full">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-400">Bulk Pricing Tiers</label>
              <button
                type="button"
                onClick={addBulkPricingTier}
                className="text-spotify-green hover:text-green-400 text-sm"
              >
                + Add Tier
              </button>
            </div>
            {formData.bulkPricing.map((tier, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={tier.quantity}
                  onChange={(e) => updateBulkPricingTier(index, 'quantity', e.target.value)}
                  className="flex-1 bg-spotify-gray text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={tier.price}
                  onChange={(e) => updateBulkPricingTier(index, 'price', e.target.value)}
                  className="flex-1 bg-spotify-gray text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                <button
                  type="button"
                  onClick={() => removeBulkPricingTier(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>


          <div className="col-span-full">
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>

          <div className="col-span-full lg:col-span-2">
            <label className="block text-gray-400 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 rounded text-spotify-green focus:ring-spotify-green"
            />
            <label htmlFor="inStock" className="text-gray-400">In Stock</label>
          </div>

          <div className="col-span-full flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-spotify-green hover:bg-green-400 text-black font-semibold py-2 rounded-lg transition-colors"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="flex-1 bg-spotify-gray hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-spotify-light-gray text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-spotify-light-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-spotify-light-gray rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-spotify-gray">
                <th className="text-left p-4 text-gray-400 font-medium">Product</th>
                <th className="text-left p-4 text-gray-400 font-medium">SKU</th>
                <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                <th className="text-left p-4 text-gray-400 font-medium">Wholesale Price</th>
                <th className="text-left p-4 text-gray-400 font-medium">Stock</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    No wholesale products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-spotify-gray hover:bg-spotify-gray/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-spotify-gray rounded flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">{product.strain || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{product.sku || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-spotify-gray rounded text-xs text-gray-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-white">${product.wholesalePrice}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.inStock 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.inStock ? `${product.stockQuantity || 0} units` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-spotify-gray rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-spotify-gray rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default WholesaleManagement;