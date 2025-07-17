import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Bell, User, ChevronDown, ShoppingCart, Menu, X, LogOut, Heart, Settings, User2, Package } from 'lucide-react';
import { useCart } from '../context/ShopifyCartContext';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { useLogos } from '../context/LogosContext';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

const SpotifyTopBar = ({ onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { products } = useProducts();
  const { user, userData, logout } = useAuth();
  const { posts } = useBlog();
  const { logos } = useLogos();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);
  // cartCount is now available directly from useCart

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/wholesale', label: 'Wholesale' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5); // Show max 5 predictions
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  // Close search when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (showSearch) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showSearch]);

  // Close search when clicking outside
  useEffect(() => {
    if (!showSearch) return;

    const handleClickOutside = (event) => {
      const searchContainer = document.getElementById('search-container');
      const searchContainerMobile = document.getElementById('search-container-mobile');
      const searchButton = document.getElementById('search-button');
      const searchButtonMobile = document.getElementById('search-button-mobile');
      
      // Check if any search elements exist
      const isInSearchContainer = searchContainer && searchContainer.contains(event.target);
      const isInSearchContainerMobile = searchContainerMobile && searchContainerMobile.contains(event.target);
      const isInSearchButton = searchButton && searchButton.contains(event.target);
      const isInSearchButtonMobile = searchButtonMobile && searchButtonMobile.contains(event.target);
      
      // If click is outside all search-related elements, close search
      if (!isInSearchContainer && !isInSearchContainerMobile && !isInSearchButton && !isInSearchButtonMobile) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    // Add event listener after a short delay to avoid immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <>
    <header className="bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {/* Desktop Logo */}
              <img 
                src={logos?.desktop?.url || "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"} 
                alt={logos?.desktop?.alt || "Kushie"} 
                className="hidden md:block"
                style={{
                  width: logos?.desktop?.width === 'auto' ? 'auto' : `${logos?.desktop?.width}px`,
                  height: logos?.desktop?.height === 'auto' ? 'auto' : `${logos?.desktop?.height}px`
                }}
              />
              {/* Mobile Logo */}
              <img 
                src={logos?.mobile?.url || "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Kushie%20Icon%20Logo%20(W-SVG).svg"} 
                alt={logos?.mobile?.alt || "Kushie"} 
                className="md:hidden"
                style={{
                  width: logos?.mobile?.width === 'auto' ? 'auto' : `${logos?.mobile?.width}px`,
                  height: logos?.mobile?.height === 'auto' ? 'auto' : `${logos?.mobile?.height}px`
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-colors hover:text-white ${
                    isActive(link.path) ? 'text-white' : 'text-text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center - Search bar (show when search is active) */}
          {showSearch && (
            <div id="search-container" ref={searchRef} className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-md z-50">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center bg-spotify-light-gray rounded-full px-4 py-2 border border-spotify-card-hover">
                  <Search className="h-4 w-4 text-text-secondary mr-3" />
                  <input
                    type="text"
                    placeholder="What do you want to find?"
                    className="bg-transparent text-white placeholder-text-secondary outline-none flex-1 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                
                {/* Search predictions dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-spotify-light-gray rounded-lg shadow-xl border border-spotify-card-hover overflow-hidden">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/shop?search=${encodeURIComponent(product.name)}`}
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-spotify-card-hover transition-colors"
                      >
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-semibold">{product.name}</h4>
                          <p className="text-text-secondary text-xs">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">

            {/* Search button - Desktop only */}
            <button 
              id="search-button"
              ref={searchButtonRef}
              onClick={() => setShowSearch(!showSearch)}
              className="hidden md:block text-primary font-bold text-sm px-6 py-2 hover:text-primary-hover hover:scale-105 transition-transform"
            >
              Search
            </button>

            {/* Shop button - Desktop only */}
            <Link to="/shop" className="hidden md:flex bg-primary text-white font-bold text-sm px-4 py-2 rounded-full hover:bg-primary-hover hover:scale-105 transition-transform items-center gap-2">
              Shop
            </Link>
            
            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="relative bg-black/70 rounded-full p-2 hover:bg-black transition-colors group"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in group-hover:scale-110 transition-transform">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            
            {/* Blog/Notifications */}
            <Link to="/blog" className="relative bg-black/70 rounded-full p-2 hover:bg-black transition-colors group">
              <Bell className="h-5 w-5 text-white" />
              {posts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in group-hover:scale-110 transition-transform">
                  {posts.length > 9 ? '9+' : posts.length}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-gray-dark rounded-full p-1 hover:bg-gray transition-colors flex items-center gap-2"
              >
                <div className="bg-gray-light rounded-full p-1.5">
                  <User className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className={`h-4 w-4 text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-dark rounded-md shadow-xl py-1 border border-border">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-white font-semibold">{user.displayName || user.email}</p>
                        <p className="text-xs text-spotify-text-subdued">{userData?.role || 'Customer'}</p>
                      </div>
                      <a href="/account" className="block px-4 py-3 text-sm text-white hover:bg-gray flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Account
                      </a>
                      <Link to="/wishlist" className="block px-4 py-3 text-sm text-white hover:bg-gray flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        My Wishlist
                      </Link>
                      <a href="/orders" className="block px-4 py-3 text-sm text-white hover:bg-gray flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        My Orders
                      </a>
                      <div className="border-t border-border"></div>
                      <button 
                        onClick={async () => {
                          await logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-gray flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowSignIn(true);
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-gray"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setShowSignUp(true);
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-gray"
                      >
                        Sign Up
                      </button>
                      <div className="border-t border-border"></div>
                      <a href="/admin/login" className="block px-4 py-3 text-sm text-spotify-text-subdued hover:bg-gray">
                        Admin Access
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden bg-gray-dark rounded-full p-2 hover:bg-gray transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`text-lg font-bold py-2 px-4 rounded-md transition-colors hover:bg-gray-dark ${
                    isActive(link.path) ? 'text-white bg-gray-dark' : 'text-text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-2">
                <button 
                  id="search-button-mobile"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowSearch(true);
                  }}
                  className="block text-primary font-bold text-lg py-2 px-4 w-full text-left hover:bg-gray-dark rounded-md"
                >
                  Search
                </button>
                <Link to="/shop" className="block bg-primary text-white font-bold text-lg py-2 px-4 w-full rounded-md mt-2 hover:bg-primary-hover text-center">
                  Shop
                </Link>
              </div>
            </div>
          </nav>
        )}

        {/* Mobile Search */}
        {showSearch && (
          <div id="search-container-mobile" className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center bg-spotify-light-gray rounded-full px-4 py-2 border border-spotify-card-hover">
                <Search className="h-4 w-4 text-text-secondary mr-3" />
                <input
                  type="text"
                  placeholder="What do you want to find?"
                  className="bg-transparent text-white placeholder-text-secondary outline-none flex-1 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              
              {/* Search predictions dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-spotify-light-gray rounded-lg shadow-xl border border-spotify-card-hover overflow-hidden z-50">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/shop?search=${encodeURIComponent(product.name)}`}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-spotify-card-hover transition-colors"
                    >
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-semibold">{product.name}</h4>
                        <p className="text-text-secondary text-xs">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </header>

    {/* Authentication Modals */}
    <SignIn 
      isOpen={showSignIn}
      onClose={() => setShowSignIn(false)}
      onSwitchToSignUp={() => {
        setShowSignIn(false);
        setShowSignUp(true);
      }}
    />
    <SignUp 
      isOpen={showSignUp}
      onClose={() => setShowSignUp(false)}
      onSwitchToSignIn={() => {
        setShowSignUp(false);
        setShowSignIn(true);
      }}
    />
    </>
  );
};

export default SpotifyTopBar;