import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Filter, X, Eye, Heart } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ProductModal from '../components/ProductModal';

const Shop = () => {
  const { products, loading } = useProducts();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchQuery(search);
  }, [location.search]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'flower', name: 'Flower' },
    { id: 'edible', name: 'Edibles' },
    { id: 'concentrate', name: 'Concentrates' },
    { id: 'cartridge', name: 'Cartridges' },
    { id: 'disposable', name: 'Disposables' },
    { id: 'pod', name: 'Pods' },
    { id: 'battery', name: 'Batteries' },
    { id: 'infused-preroll', name: 'Infused Prerolls' },
    { id: 'preroll', name: 'Prerolls' },
    { id: 'merch', name: 'Merchandise' },
    { id: 'distillate', name: 'Distillate' },
    { id: 'liquid-diamonds', name: 'Liquid Diamonds' },
    { id: 'live-resin-diamonds', name: 'Live Resin Diamonds' },
    { id: 'hash-infused-preroll', name: 'Hash Infused Prerolls' },
    { id: 'infused-preroll-5pack', name: 'Infused Prerolls 5-Pack' },
  ];

  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
    
    // Filter by search query
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Update category counts based on search
  const getFilteredCount = (categoryId) => {
    return products.filter(p => {
      const matchesCategory = categoryId === 'all' || p.type === categoryId;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).length;
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (product, e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-black border-r border-border p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-6">Filter by Category</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                selectedCategory === category.id
                  ? 'bg-gray-dark text-white'
                  : 'text-text-secondary hover:text-white hover:bg-gray-dark/50'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-sm">{getFilteredCount(category.id)}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-black">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl lg:text-5xl font-black text-white">
                  {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
                </h1>
                {searchQuery && (
                  <p className="text-primary mt-2">
                    Searching for: "{searchQuery}"
                  </p>
                )}
              </div>
              
              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-gray-dark text-white px-4 py-2 rounded-full hover:bg-gray transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
            
            <p className="text-text-secondary">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {searchQuery && ' found'}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product)}
                  className="group relative bg-card rounded-lg p-4 transition-all duration-300 hover:bg-card-hover cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-gray-dark">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-2xl transition-all hover:scale-110 hover:bg-white"
                        title="Quick view"
                      >
                        <Eye className="h-5 w-5 text-black" />
                      </button>
                      <button
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 ${
                          isInWishlist(product.id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/90 text-black hover:bg-white'
                        }`}
                        title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart className="h-4 w-4" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 ${
                          isInCart(product.id)
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-primary text-white hover:bg-primary-hover'
                        }`}
                        title={isInCart(product.id) ? 'In cart' : 'Add to cart'}
                      >
                        <ShoppingCart className="h-5 w-5" fill={isInCart(product.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-primary font-bold">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-black border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white">Filter by Category</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-dark rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowMobileFilters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                    selectedCategory === category.id
                      ? 'bg-gray-dark text-white'
                      : 'text-text-secondary hover:text-white hover:bg-gray-dark/50'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-sm">{getFilteredCount(category.id)}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Shop;