import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, ShoppingCart, Heart } from 'lucide-react';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { useCart } from '../context/ShopifyCartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductModal from './ProductModal';
import ProductHoverActions from './ProductHoverActions';
import DisclosureCards from './DisclosureCards';
import InfiniteProductSlider from './InfiniteProductSlider';

const SpotifyHomeDynamic = ({ onCartClick }) => {
  const { shopifyProducts } = useEnhancedProducts();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  // Removed old scroll refs as we're using InfiniteProductSlider component

  // Time-based greeting like Spotify
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter hemp category products from Shopify
  // Check multiple fields for hemp-related content
  const hempProducts = shopifyProducts.filter(product => {
    // Check product type
    if (product.productType?.toLowerCase().includes('hemp')) return true;
    
    // Check tags array
    if (product.tags?.some(tag => 
      typeof tag === 'string' && tag.toLowerCase().includes('hemp')
    )) return true;
    
    // Check vendor
    if (product.vendor?.toLowerCase().includes('hemp')) return true;
    
    // Check title/name
    if (product.title?.toLowerCase().includes('hemp') || 
        product.name?.toLowerCase().includes('hemp')) return true;
    
    // Check collections (might be array of objects or strings)
    if (product.collections?.some(collection => {
      if (typeof collection === 'string') {
        return collection.toLowerCase().includes('hemp');
      } else if (collection?.title) {
        return collection.title.toLowerCase().includes('hemp');
      } else if (collection?.name) {
        return collection.name.toLowerCase().includes('hemp');
      }
      return false;
    })) return true;
    
    // Check category (sometimes stored differently)
    if (product.category?.toLowerCase().includes('hemp')) return true;
    
    // Check product handle
    if (product.handle?.toLowerCase().includes('hemp')) return true;
    
    return false;
  }).slice(0, 10); // Limit to 10 products

  // Log first product to see structure (temporary for debugging)
  if (shopifyProducts.length > 0) {
    console.log('Sample product structure:', shopifyProducts[0]);
    console.log('Hemp products found:', hempProducts.length);
  }

  // Fallback to all products if no hemp products found
  const productsToShow = hempProducts.length > 0 ? hempProducts : shopifyProducts.slice(0, 10);

  // Filter sale products from Shopify
  const saleProducts = shopifyProducts.filter(product => {
    // Check various fields for sale indicators
    if (product.tags?.some(tag => 
      typeof tag === 'string' && (
        tag.toLowerCase().includes('sale') ||
        tag.toLowerCase().includes('discount') ||
        tag.toLowerCase().includes('clearance')
      )
    )) return true;
    
    // Check if product has compare_at_price (indicates it's on sale)
    if (product.compareAtPrice && product.price < product.compareAtPrice) return true;
    
    // Check collections for sale
    if (product.collections?.some(collection => {
      if (typeof collection === 'string') {
        return collection.toLowerCase().includes('sale');
      } else if (collection?.title) {
        return collection.title.toLowerCase().includes('sale');
      } else if (collection?.name) {
        return collection.name.toLowerCase().includes('sale');
      }
      return false;
    })) return true;
    
    return false;
  }).slice(0, 10); // Limit to 10 products

  // Fallback to all products if no sale products found
  const saleProductsToShow = saleProducts.length > 0 ? saleProducts : shopifyProducts.slice(10, 20);

  // Handle product interactions
  const handleProductClick = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Don't open modal if we were dragging
    if (isDragging) return;
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Removed old scroll functions as they're now handled by InfiniteProductSlider component

  return (
    <div className="space-y-0 -mt-4 md:mt-0">
      {/* Hero Section with Video Background */}
      <section className="relative h-[calc(100vh-3rem)] md:h-[78vh] w-full overflow-hidden hero-mobile-fix md:mt-0">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Videos/Horizontal%20Videos/Hero%20Section.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Optional overlay for better contrast if needed */}
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* Spotify-themed Product Slider Section */}
      {productsToShow.length > 0 && (
        <section className="bg-gradient-to-b from-gray-900 to-black py-8">
          <div className="w-full px-4 md:px-8">
            {/* Greeting Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {getGreeting()}
              </h1>
              <p className="text-spotify-text-subdued text-lg">
                {hempProducts.length > 0 ? 'Hemp products to enhance your experience' : 'Featured products for you'}
              </p>
            </div>

            {/* Products Slider - Infinite Scroll */}
            <InfiniteProductSlider
              products={productsToShow}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
              isVerticalCard={false}
              sliderId="good-evening"
            />
          </div>
        </section>
      )}

      {/* Secondary Hero Section with Gold Cartridges Video */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Videos/Horizontal%20Videos/Gold%20Cartridges%20Video.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Gold Standard Cartridges
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Premium distillate with natural terpenes. Pure, potent, and perfectly crafted for the ultimate vaping experience.
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Hemp Products Slider Section */}
      {hempProducts.length > 0 && (
        <section className="bg-gradient-to-b from-gray-900 to-black py-8">
          <div className="w-full px-4 md:px-8">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Premium Hemp Collection
              </h2>
              <p className="text-spotify-text-subdued text-lg">
                Discover our curated selection of high-quality hemp products
              </p>
            </div>

            {/* Products Slider - Infinite Scroll */}
            <InfiniteProductSlider
              products={hempProducts}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
              isVerticalCard={true}
              sliderId="hemp-collection"
            />
          </div>
        </section>
      )}

      {/* Disclosure Cards Section */}
      <DisclosureCards />

      {/* Sale Products Slider Section - Moved after Disclosure Cards */}
      {saleProductsToShow.length > 0 && (
        <section className="bg-gradient-to-b from-black to-gray-900 py-8">
          <div className="w-full px-4 md:px-8">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                On Sale Now
              </h2>
              <p className="text-spotify-text-subdued text-lg">
                {saleProducts.length > 0 ? 'Limited time offers on premium products' : 'Check out these featured products'}
              </p>
            </div>

            {/* Products Slider - Infinite Scroll */}
            <InfiniteProductSlider
              products={saleProductsToShow}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
              isVerticalCard={true}
              sliderId="sale-products"
            />
          </div>
        </section>
      )}

      {/* Black Disposables Video Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Videos/Horizontal%20Videos/Black%20Dspsbls.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Premium Black Disposables
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Sleek design meets superior performance. Experience the perfect blend of style and potency.
            </p>
            <Link 
              to="/shop?category=disposables" 
              className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={handleCloseModal}
        onCartClick={onCartClick}
      />
    </div>
  );
};

export default SpotifyHomeDynamic;