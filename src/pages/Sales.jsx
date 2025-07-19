import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, UserPlus, Users, FileText, LogOut, Eye, ChevronDown, X } from 'lucide-react';
import SalesLogin from '../components/SalesLogin';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import ProductModal from '../components/ProductModal';
import CartSlideOut from '../components/CartSlideOut';

const Sales = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSessionAuthenticated, setIsSessionAuthenticated] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const customerDropdownRef = useRef(null);
  
  // Wholesale products and cart
  const { firebaseProducts, loading } = useEnhancedProducts();
  const { cart, addToCart, updateQuantity, removeFromCart, getCartTotal, clearCart, setCustomerForOrder } = useWholesaleCart();

  // Always require login for each visit - no persistence
  useEffect(() => {
    // Even if user is logged in as sales rep, require re-authentication
    setIsAuthenticated(false);
    setIsSessionAuthenticated(false);
  }, []);

  // Load customers from Firestore
  useEffect(() => {
    if (!isSessionAuthenticated) return;

    const usersRef = collection(db, 'users');
    
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const customersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.role === 'customer' && !user.isDeleted)
        .sort((a, b) => {
          const nameA = a.displayName || a.email || '';
          const nameB = b.displayName || b.email || '';
          return nameA.localeCompare(nameB);
        });
      
      setCustomers(customersData);
      console.log('Loaded customers:', customersData.length);
    }, (error) => {
      console.error('Error loading customers:', error);
    });

    return () => unsubscribe();
  }, [isSessionAuthenticated]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setIsCustomerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get categories with counts
  const categoriesWithCounts = useMemo(() => {
    const categoryMap = new Map();
    
    firebaseProducts.forEach(product => {
      if (product.category) {
        const count = categoryMap.get(product.category) || 0;
        categoryMap.set(product.category, count + 1);
      }
    });
    
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [firebaseProducts]);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    
    const search = customerSearch.toLowerCase();
    return customers.filter(customer => 
      customer.displayName?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search)
    );
  }, [customers, customerSearch]);

  const cards = [
    {
      title: 'New Order',
      icon: ShoppingCart,
      onClick: () => {
        setShowProducts(true);
        setShowCustomerDropdown(true);
      },
      color: 'hover:bg-green-500'
    },
    {
      title: 'New Customer',
      icon: UserPlus,
      onClick: () => console.log('New Customer clicked'),
      color: 'hover:bg-blue-500'
    },
    {
      title: 'Existing Customers',
      icon: Users,
      onClick: () => console.log('Existing Customers clicked'),
      color: 'hover:bg-purple-500'
    },
    {
      title: 'Invoices',
      icon: FileText,
      onClick: () => console.log('Invoices clicked'),
      color: 'hover:bg-orange-500'
    }
  ];

  // Show login if not authenticated for this session
  if (!isSessionAuthenticated) {
    return <SalesLogin onSuccess={() => setIsSessionAuthenticated(true)} />;
  }

  const handleLogout = async () => {
    setIsSessionAuthenticated(false);
    // Optionally sign out from Firebase too
    if (user) {
      await signOut(auth);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDropdown(false);
    setCustomerSearch('');
    // Set customer for the order in the cart context
    if (setCustomerForOrder) {
      setCustomerForOrder(customer);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black">
      {/* Header with Cards */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logout button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
            {cards.map((card, index) => (
              <button
                key={index}
                onClick={card.onClick}
                className={`bg-spotify-light-gray border border-gray-700 rounded-lg p-6 transition-all duration-300 hover:scale-105 ${card.color} hover:border-transparent group`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <card.icon className="h-8 w-8 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-white font-medium text-lg">{card.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page content below header */}
      <div className="flex-1">
        {showProducts && (
          <section className="py-8 bg-spotify-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="lg:w-64 lg:flex-shrink-0">
                  <div className="sticky top-4 space-y-6">
                    {/* Customer Selection - Same design as Filter */}
                    {showCustomerDropdown && (
                      <div className="bg-spotify-light-gray rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Select Customer</h3>
                        <div className="relative" ref={customerDropdownRef}>
                          {/* Dropdown trigger */}
                          <button
                            onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                            className="w-full bg-spotify-dark-gray text-white px-4 py-3 rounded-md flex justify-between items-center hover:bg-spotify-card-hover transition-colors"
                          >
                            <span className="text-left">
                              {selectedCustomer ? (
                                <div>
                                  <div className="font-medium">{selectedCustomer.displayName || 'No Name'}</div>
                                  <div className="text-sm text-gray-400">{selectedCustomer.email}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">Select a customer...</span>
                              )}
                            </span>
                            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isCustomerDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Dropdown menu */}
                          {isCustomerDropdownOpen && (
                            <div className="absolute top-full mt-2 w-full bg-spotify-dark-gray rounded-md shadow-lg z-20 max-h-64 overflow-hidden">
                              {/* Search input */}
                              <div className="p-3 border-b border-spotify-card-hover">
                                <input
                                  type="text"
                                  value={customerSearch}
                                  onChange={(e) => setCustomerSearch(e.target.value)}
                                  placeholder="Search customers..."
                                  className="w-full bg-spotify-light-gray text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              
                              {/* Customer list */}
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCustomers.length > 0 ? (
                                  filteredCustomers.map((customer) => (
                                    <button
                                      key={customer.id}
                                      onClick={() => {
                                        handleCustomerSelect(customer);
                                        setIsCustomerDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-4 py-3 hover:bg-spotify-card-hover transition-colors border-b border-spotify-light-gray last:border-0"
                                    >
                                      <div className="text-white font-medium">{customer.displayName || 'No Name'}</div>
                                      <div className="text-gray-400 text-sm">{customer.email}</div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-6 text-gray-400 text-center">
                                    {customerSearch ? 'No customers found' : 'No customers available'}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Selected customer indicator */}
                        {selectedCustomer && (
                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-green-400">✓ Customer selected</span>
                            <button
                              onClick={() => {
                                setSelectedCustomer(null);
                                setCustomerSearch('');
                                if (setCustomerForOrder) {
                                  setCustomerForOrder(null);
                                }
                              }}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Filter by Category */}
                    <div className="bg-spotify-light-gray rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-6">Filter by Category</h3>
                      <nav className="space-y-1">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                            selectedCategory === 'all'
                              ? 'bg-primary text-white'
                              : 'text-gray-400 hover:text-white hover:bg-spotify-dark-gray'
                          }`}
                        >
                          <span>All Products</span>
                          <span className="text-sm">{firebaseProducts.length}</span>
                        </button>
                        {categoriesWithCounts.map(({ name, count }) => (
                          <button
                            key={name}
                            onClick={() => setSelectedCategory(name)}
                            className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                              selectedCategory === name
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:text-white hover:bg-spotify-dark-gray'
                            }`}
                          >
                            <span>{name}</span>
                            <span className="text-sm">{count}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-2">
                      {selectedCategory === 'all' ? 'All Wholesale Products' : selectedCategory}
                    </h2>
                    <p className="text-gray-400">
                      {firebaseProducts.filter(product => selectedCategory === 'all' || product.category === selectedCategory).length} products available
                    </p>
                  </div>

                  {/* Products Grid */}
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {firebaseProducts
                        .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
                        .map((product) => (
                          <div 
                            key={product.id} 
                            className="group relative bg-spotify-light-gray rounded-lg p-4 transition-all duration-300 hover:bg-spotify-dark-gray"
                          >
                            {/* Product Image */}
                            <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-gray-900">
                              {product.imageUrl && (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              )}
                              
                              {/* Hover Actions */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProduct(product);
                                    setShowProductModal(true);
                                  }}
                                  className="p-3 bg-white rounded-full text-black hover:bg-gray-200 transition-colors"
                                  title="Quick View"
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                  }}
                                  className="p-3 bg-primary rounded-full text-white hover:bg-primary-hover transition-colors"
                                  title="Add to Cart"
                                >
                                  <ShoppingCart className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div>
                              <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
                              <p className="text-primary font-bold">${product.price}</p>
                              {product.category && (
                                <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      
      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setTimeout(() => setSelectedProduct(null), 300);
        }}
        onCartClick={() => setShowCart(true)}
        isWholesale={true}
      />
      
      {/* Cart Slide Out */}
      <CartSlideOut 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        isWholesale={true}
      />
      
      {/* Floating Cart Button */}
      {showProducts && cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary-hover text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default Sales;