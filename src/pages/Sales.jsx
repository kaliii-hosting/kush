import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, UserPlus, Users, FileText, LogOut, Eye, ChevronDown, X, Filter, Mail, Phone, Building, MapPin, Hash } from 'lucide-react';
import SalesLogin from '../components/SalesLogin';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { collection, onSnapshot, query, where, orderBy, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import ProductModal from '../components/ProductModal';
import CartSlideOut from '../components/CartSlideOut';
import './Sales.css';

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
  const [showCustomerInHeader, setShowCustomerInHeader] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
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

  // Define all available categories (from ProductForm)
  const allCategories = [
    'Flower',
    'Edible',
    'Concentrate',
    'Cartridges',
    'Disposables',
    'Pods',
    'Batteries',
    'Infused Prerolls',
    'Prerolls',
    'Merch',
    'Distillate',
    'Liquid Diamonds',
    'Live Resin Diamonds',
    'Hash Infused Prerolls',
    'Infused Prerolls - 5 Pack'
  ];

  // Get categories with counts
  const categoriesWithCounts = useMemo(() => {
    const categoryMap = new Map();
    
    // Initialize all categories with 0 count
    allCategories.forEach(cat => {
      categoryMap.set(cat, 0);
    });
    
    // Count products by category (using type field for Firebase products)
    firebaseProducts.forEach(product => {
      const category = product.category || product.type;
      if (category) {
        // Convert type values to display names
        const displayCategory = category
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace('Infused Preroll', 'Infused Prerolls')
          .replace('Preroll', 'Prerolls')
          .replace('Cartridge', 'Cartridges')
          .replace('Disposable', 'Disposables')
          .replace('Pod', 'Pods')
          .replace('Battery', 'Batteries');
        
        const currentCount = categoryMap.get(displayCategory) || 0;
        categoryMap.set(displayCategory, currentCount + 1);
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
        setShowCustomerDropdown(false);
        setShowCustomerInHeader(true);
      },
      color: 'hover:bg-green-500'
    },
    {
      title: 'Add Customer',
      icon: UserPlus,
      onClick: () => {
        setShowAddCustomerForm(true);
        setShowProducts(false);
      },
      color: 'hover:bg-blue-500'
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

  // Handle add customer form submission
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');
    setFormSuccess(false);

    const formData = new FormData(e.target);
    const customerData = {
      email: formData.get('email'),
      password: formData.get('password'),
      displayName: formData.get('displayName'),
      phone: formData.get('phone') || '',
      businessName: formData.get('businessName') || '',
      licenseNumber: formData.get('licenseNumber') || '',
      address: formData.get('address') || '',
      role: 'customer',
      createdAt: new Date(),
      isDeleted: false
    };

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        customerData.email,
        customerData.password
      );

      // Add user data to Firestore with UID as document ID
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: customerData.email,
        displayName: customerData.displayName,
        phone: customerData.phone,
        businessName: customerData.businessName,
        licenseNumber: customerData.licenseNumber,
        address: customerData.address,
        role: customerData.role,
        createdAt: customerData.createdAt,
        isDeleted: customerData.isDeleted
      });

      setFormSuccess(true);
      
      // Reset form and show success message
      e.target.reset();
      
      // After 2 seconds, close the form
      setTimeout(() => {
        setShowAddCustomerForm(false);
        setFormSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating customer:', error);
      let errorMessage = 'Failed to create customer account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      }
      
      setFormError(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black">
      {/* Header with Cards */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top header bar with logo and logout */}
          <div className="flex justify-between items-center py-4 border-b border-gray-800/50">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Kushie%20Kaliii%20Logo.svg"
                alt="Kushie Logo"
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            
            {/* Sales Dashboard Title */}
            <h1 className="text-2xl font-bold text-white hidden sm:block">Sales Dashboard</h1>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm bg-spotify-light-gray hover:bg-spotify-dark-gray px-4 py-2 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
            {cards.map((card, index) => (
              <div key={index} className="gradient-button-wrap">
                <button
                  onClick={card.onClick}
                  className="gradient-button"
                >
                  <card.icon />
                  {card.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page content below header */}
      <div className="flex-1">
        {showProducts && (
          <div className="flex h-full bg-black">
            {/* Desktop Sidebar - Match Shop Page Style */}
            <aside className="hidden lg:block w-64 bg-black border-r border-gray-800 p-6 overflow-y-auto">
              <h2 className="text-lg font-bold text-white mb-6">Filter by Category</h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                    selectedCategory === 'all'
                      ? 'bg-spotify-dark-gray text-white'
                      : 'text-gray-400 hover:text-white hover:bg-spotify-dark-gray/50'
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
                        ? 'bg-spotify-dark-gray text-white'
                        : 'text-gray-400 hover:text-white hover:bg-spotify-dark-gray/50'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="text-sm">{count}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-black">
              <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                    <div>
                      <h1 className="text-3xl lg:text-5xl font-black text-white">
                        {selectedCategory === 'all' ? 'All Wholesale Products' : selectedCategory}
                      </h1>
                    </div>
                    
                    {/* Customer Dropdown - Right side on desktop */}
                    {showCustomerInHeader && (
                      <div className="lg:ml-auto">
                        <div className="relative w-full sm:max-w-md lg:w-80" ref={customerDropdownRef}>
                          {/* Dropdown trigger */}
                          <button
                            onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                            className="w-full bg-spotify-light-gray text-white px-4 py-3 rounded-lg flex justify-between items-center hover:bg-spotify-dark-gray transition-all duration-200 border border-gray-700 shadow-sm hover:shadow-md"
                          >
                            <span className="text-left flex-1 mr-2">
                              {selectedCustomer ? (
                                <div>
                                  <div className="font-medium text-sm sm:text-base">{selectedCustomer.displayName || 'No Name'}</div>
                                  <div className="text-xs sm:text-sm text-gray-400 truncate">{selectedCustomer.email}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm sm:text-base">Select a customer...</span>
                              )}
                            </span>
                            <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform flex-shrink-0 ${isCustomerDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Dropdown menu */}
                          {isCustomerDropdownOpen && (
                            <div className="absolute top-full mt-2 w-full bg-spotify-light-gray rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-700 max-h-[calc(100vh-200px)] sm:max-h-96">
                              {/* Search input */}
                              <div className="p-3 border-b border-gray-700 bg-spotify-dark-gray sticky top-0 z-10">
                                <input
                                  type="text"
                                  value={customerSearch}
                                  onChange={(e) => setCustomerSearch(e.target.value)}
                                  placeholder="Search customers..."
                                  className="w-full bg-spotify-light-gray text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder-gray-500"
                                  onClick={(e) => e.stopPropagation()}
                                  autoFocus
                                />
                              </div>
                              
                              {/* Customer list */}
                              <div className="max-h-[calc(100vh-300px)] sm:max-h-64 overflow-y-auto bg-spotify-dark-gray">
                                {filteredCustomers.length > 0 ? (
                                  filteredCustomers.map((customer) => (
                                    <button
                                      key={customer.id}
                                      onClick={() => {
                                        handleCustomerSelect(customer);
                                        setIsCustomerDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-4 py-3 hover:bg-spotify-card-hover active:bg-spotify-card-hover transition-colors border-b border-gray-700 last:border-0 group"
                                    >
                                      <div className="text-white font-medium text-sm sm:text-base group-hover:text-primary transition-colors">{customer.displayName || 'No Name'}</div>
                                      <div className="text-gray-400 text-xs sm:text-sm truncate">{customer.email}</div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-8 text-gray-400 text-center text-sm">
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
                            <span className="text-green-400 flex items-center gap-2">
                              <span className="text-lg">✓</span> Customer selected
                            </span>
                            <button
                              onClick={() => {
                                setSelectedCustomer(null);
                                setCustomerSearch('');
                                if (setCustomerForOrder) {
                                  setCustomerForOrder(null);
                                }
                              }}
                              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 bg-spotify-dark-gray text-white px-4 py-2 rounded-full hover:bg-spotify-card-hover transition-colors mb-4"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                  
                  <p className="text-gray-400">
                      {firebaseProducts.filter(product => {
                        if (selectedCategory === 'all') return true;
                        
                        const productCategory = product.category || product.type;
                        if (!productCategory) return false;
                        
                        const displayCategory = productCategory
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                          .replace('Infused Preroll', 'Infused Prerolls')
                          .replace('Preroll', 'Prerolls')
                          .replace('Cartridge', 'Cartridges')
                          .replace('Disposable', 'Disposables')
                          .replace('Pod', 'Pods')
                          .replace('Battery', 'Batteries');
                        
                        return displayCategory === selectedCategory;
                      }).length} {firebaseProducts.filter(product => {
                        if (selectedCategory === 'all') return true;
                        
                        const productCategory = product.category || product.type;
                        if (!productCategory) return false;
                        
                        const displayCategory = productCategory
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                          .replace('Infused Preroll', 'Infused Prerolls')
                          .replace('Preroll', 'Prerolls')
                          .replace('Cartridge', 'Cartridges')
                          .replace('Disposable', 'Disposables')
                          .replace('Pod', 'Pods')
                          .replace('Battery', 'Batteries');
                        
                        return displayCategory === selectedCategory;
                      }).length === 1 ? 'product' : 'products'}
                  </p>
                </div>

                {/* Products Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                      {firebaseProducts
                        .filter(product => {
                          if (selectedCategory === 'all') return true;
                          
                          // Get product category (from category or type field)
                          const productCategory = product.category || product.type;
                          if (!productCategory) return false;
                          
                          // Convert to display format
                          const displayCategory = productCategory
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                            .replace('Infused Preroll', 'Infused Prerolls')
                            .replace('Preroll', 'Prerolls')
                            .replace('Cartridge', 'Cartridges')
                            .replace('Disposable', 'Disposables')
                            .replace('Pod', 'Pods')
                            .replace('Battery', 'Batteries');
                          
                          return displayCategory === selectedCategory;
                        })
                        .map((product) => (
                          <div 
                            key={product.id} 
                            className="group relative bg-spotify-light-gray rounded-lg p-4 transition-all duration-300 hover:bg-spotify-dark-gray cursor-pointer"
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
            
            {/* Mobile Filters Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="fixed inset-0 bg-black/80" onClick={() => setShowMobileFilters(false)} />
                <div className="fixed right-0 top-0 h-full w-80 bg-black border-l border-gray-800 p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold text-white">Filter by Category</h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-spotify-dark-gray rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  
                  <nav className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                        selectedCategory === 'all'
                          ? 'bg-spotify-dark-gray text-white'
                          : 'text-gray-400 hover:text-white hover:bg-spotify-dark-gray/50'
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-sm">{firebaseProducts.length}</span>
                    </button>
                    {categoriesWithCounts.map(({ name, count }) => (
                      <button
                        key={name}
                        onClick={() => {
                          setSelectedCategory(name);
                          setShowMobileFilters(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center ${
                          selectedCategory === name
                            ? 'bg-spotify-dark-gray text-white'
                            : 'text-gray-400 hover:text-white hover:bg-spotify-dark-gray/50'
                        }`}
                      >
                        <span>{name}</span>
                        <span className="text-sm">{count}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Add Customer Form */}
        {showAddCustomerForm && (
          <div className="flex h-full bg-black">
            <div className="flex-1 bg-black">
              <div className="p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Form Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-black text-white">Add New Customer</h1>
                      <p className="text-gray-400 mt-2">Create a new customer account</p>
                    </div>
                    <button
                      onClick={() => setShowAddCustomerForm(false)}
                      className="p-2 hover:bg-spotify-dark-gray rounded-full transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                {formSuccess && (
                  <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-400 flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    Customer account created successfully!
                  </div>
                )}

                {/* Error Message */}
                {formError && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
                    {formError}
                  </div>
                )}

                {/* Customer Sign Up Form */}
                <form onSubmit={handleAddCustomer} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-spotify-light-gray border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="customer@example.com"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-spotify-light-gray border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Minimum 6 characters"
                      />
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <UserPlus className="inline h-4 w-4 mr-2" />
                        Display Name *
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        required
                        className="w-full px-4 py-3 bg-spotify-light-gray border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Customer Name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 bg-spotify-light-gray border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Building className="inline h-4 w-4 mr-2" />
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        className="w-full px-4 py-3 bg-spotify-light-gray border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Business Name"
                      />
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Hash className="inline h-4 w-4 mr-2" />
                        License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        className="w-full px-4 py-3 bg-spotify-light-gray border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="License #"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      className="w-full px-4 py-3 bg-spotify-light-gray border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                      placeholder="Enter full address"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                          Creating Account...
                        </span>
                      ) : (
                        'Create Customer Account'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomerForm(false)}
                      className="px-6 py-3 bg-spotify-light-gray hover:bg-spotify-dark-gray text-white font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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