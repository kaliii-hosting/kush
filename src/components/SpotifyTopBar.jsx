import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, User, ChevronDown, ShoppingCart, Menu, X, LogOut, Heart, Settings, User2, Package } from 'lucide-react';
import { useCart } from '../context/ShopifyCartContext';
import { useWholesaleCart } from '../context/WholesaleCartContext';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { useLogos } from '../context/LogosContext';
import { useWishlist } from '../context/WishlistContextNew';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

const SpotifyTopBar = ({ onCartClick, onWishlistClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine which cart to use based on current page
  const isWholesalePage = location.pathname.includes('/wholesale');
  const shopifyCart = useCart();
  const wholesaleCart = useWholesaleCart();
  const cartCount = isWholesalePage ? wholesaleCart.cartCount : shopifyCart.cartCount;
  
  const { user, userData, logout } = useAuth();
  const { posts } = useBlog();
  const { logos } = useLogos();
  const { wishlistItems } = useWishlist();
  
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;
  
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  // cartCount is now available directly from useCart

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/wholesale', label: 'Wholesale' },
    { path: '/about', label: 'About' },
    { path: '/lab-results', label: 'Lab Results' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
    <header className="bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between relative">
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

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">

            {/* Shop button - Desktop only */}
            <Link to="/shop" className="hidden md:flex bg-primary text-white font-bold text-sm px-4 py-2 rounded-full hover:bg-primary-hover hover:scale-105 transition-transform items-center gap-2">
              Shop
            </Link>
            
            {/* Wishlist Button - Desktop only */}
            <button 
              onClick={onWishlistClick}
              className="hidden lg:flex relative bg-black/70 rounded-full p-2 hover:bg-black transition-colors group"
            >
              <Heart className="h-5 w-5 text-white" fill={wishlistCount > 0 ? "currentColor" : "none"} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in group-hover:scale-110 transition-transform">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>
            
            {/* Cart Button - Desktop only */}
            <button 
              onClick={onCartClick}
              className="hidden lg:flex relative bg-black/70 rounded-full p-2 hover:bg-black transition-colors group"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in group-hover:scale-110 transition-transform">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            
            {/* Blog/Notifications - Desktop only */}
            <Link to="/blog" className="hidden lg:flex relative bg-black/70 rounded-full p-2 hover:bg-black transition-colors group">
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
                <Link to="/shop" className="block bg-primary text-white font-bold text-lg py-2 px-4 w-full rounded-md mt-2 hover:bg-primary-hover text-center">
                  Shop
                </Link>
                
                {/* Mobile Menu Action Buttons */}
                <div className="mt-4 space-y-3">
                  {/* Blog Button */}
                  <Link 
                    to="/blog" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-between px-4 py-3 bg-gray-dark rounded-md hover:bg-gray transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-white" />
                      <span className="text-white font-medium">Blog</span>
                    </div>
                    {posts.length > 0 && (
                      <span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {posts.length > 9 ? '9+' : posts.length}
                      </span>
                    )}
                  </Link>
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={() => {
                      onWishlistClick();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center justify-between px-4 py-3 bg-gray-dark rounded-md hover:bg-gray transition-colors w-full"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-white" fill={wishlistCount > 0 ? "currentColor" : "none"} />
                      <span className="text-white font-medium">Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Cart Button */}
                  <button 
                    onClick={() => {
                      onCartClick();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center justify-between px-4 py-3 bg-gray-dark rounded-md hover:bg-gray transition-colors w-full"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-white" />
                      <span className="text-white font-medium">Cart</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </nav>
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