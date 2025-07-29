import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, ShoppingCart, Heart } from 'lucide-react';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { useCart } from '../context/ShopifyCartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductModal from './ProductModal';
import ProductHoverActions from './ProductHoverActions';
import DisclosureCards from './DisclosureCards';

const SpotifyHomeDynamic = ({ onCartClick }) => {
  const { shopifyProducts } = useEnhancedProducts();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const scrollRef = useRef(null);
  const saleScrollRef = useRef(null);
  const hempScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  // Scroll functions
  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Mouse/Touch drag handlers for first slider
  const handleMouseDown = (e, ref) => {
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = 'grabbing';
  };

  const handleTouchStart = (e, ref) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleMouseLeave = (ref) => {
    setIsDragging(false);
    ref.current.style.cursor = 'grab';
  };

  const handleMouseUp = (ref) => {
    setIsDragging(false);
    ref.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e, ref) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e, ref) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    ref.current.scrollLeft = scrollLeft - walk;
  };

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
          <div className="max-w-[1800px] mx-auto px-4 md:px-8">
            {/* Greeting Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {getGreeting()}
              </h1>
              <p className="text-spotify-text-subdued text-lg">
                {hempProducts.length > 0 ? 'Hemp products to enhance your experience' : 'Featured products for you'}
              </p>
            </div>

            {/* Products Slider */}
            <div className="relative group">
              {/* Scroll buttons */}
              <button 
                onClick={scrollLeftBtn}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
              
              {/* Products container - Spotify playlist style */}
              <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4 cursor-grab select-none"
                onMouseDown={(e) => handleMouseDown(e, scrollRef)}
                onMouseLeave={() => handleMouseLeave(scrollRef)}
                onMouseUp={() => handleMouseUp(scrollRef)}
                onMouseMove={(e) => handleMouseMove(e, scrollRef)}
                onTouchStart={(e) => handleTouchStart(e, scrollRef)}
                onTouchMove={(e) => handleTouchMove(e, scrollRef)}
                onTouchEnd={() => handleMouseUp(scrollRef)}
              >
                {productsToShow.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative flex-shrink-0 w-[380px] cursor-pointer"
                    onClick={() => handleProductClick(product)}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative bg-spotify-light-gray rounded-md p-2 pr-4 transition-all duration-300 hover:bg-gray-700 flex items-center gap-4">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded shadow-lg">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-spotify-card flex items-center justify-center">
                            <span className="text-spotify-text-subdued text-2xl">🌿</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-base leading-tight truncate mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 text-spotify-text-subdued text-sm">
                          <span className="font-medium">${product.price}</span>
                          {product.productType && (
                            <>
                              <span className="text-spotify-text-subdued/50">•</span>
                              <span className="capitalize">{product.productType}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Hover Actions - Centered */}
                      {hoveredCard === product.id && (
                        <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => handleToggleWishlist(product, e)}
                            className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                            title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart 
                              className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-white text-white' : 'text-white'}`}
                            />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          <div className="max-w-[1800px] mx-auto px-4 md:px-8">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Premium Hemp Collection
              </h2>
              <p className="text-spotify-text-subdued text-lg">
                Discover our curated selection of high-quality hemp products
              </p>
            </div>

            {/* Products Slider */}
            <div className="relative group">
              {/* Scroll buttons */}
              <button 
                onClick={() => {
                  if (hempScrollRef.current) {
                    hempScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button 
                onClick={() => {
                  if (hempScrollRef.current) {
                    hempScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
              
              {/* Products container - Vertical card style like sale slider */}
              <div 
                ref={hempScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 cursor-grab select-none"
                onMouseDown={(e) => handleMouseDown(e, hempScrollRef)}
                onMouseLeave={() => handleMouseLeave(hempScrollRef)}
                onMouseUp={() => handleMouseUp(hempScrollRef)}
                onMouseMove={(e) => handleMouseMove(e, hempScrollRef)}
                onTouchStart={(e) => handleTouchStart(e, hempScrollRef)}
                onTouchMove={(e) => handleTouchMove(e, hempScrollRef)}
                onTouchEnd={() => handleMouseUp(hempScrollRef)}
              >
                {hempProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative flex-shrink-0 w-[200px] cursor-pointer"
                    onClick={() => handleProductClick(product)}
                    onMouseEnter={() => setHoveredCard(`hemp-${product.id}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative bg-spotify-light-gray rounded-lg p-4 transition-all duration-300 hover:bg-gray-700">
                      {/* Product Image */}
                      <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-md shadow-lg">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-spotify-card flex items-center justify-center">
                            <span className="text-spotify-text-subdued text-4xl">🌿</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="space-y-1">
                          <span className="text-white font-semibold text-lg">${product.price}</span>
                          {product.productType && (
                            <p className="text-spotify-text-subdued text-xs capitalize">{product.productType}</p>
                          )}
                        </div>
                      </div>

                      {/* Hover Actions - Overlay */}
                      {hoveredCard === `hemp-${product.id}` && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => handleToggleWishlist(product, e)}
                            className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                            title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart 
                              className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-white text-white' : 'text-white'}`}
                            />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Disclosure Cards Section */}
      <DisclosureCards />

      {/* Sale Products Slider Section - Moved after Disclosure Cards */}
      {saleProductsToShow.length > 0 && (
        <section className="bg-gradient-to-b from-black to-gray-900 py-8">
          <div className="max-w-[1800px] mx-auto px-4 md:px-8">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                On Sale Now
              </h2>
              <p className="text-spotify-text-subdued text-lg">
                {saleProducts.length > 0 ? 'Limited time offers on premium products' : 'Check out these featured products'}
              </p>
            </div>

            {/* Products Slider */}
            <div className="relative group">
              {/* Scroll buttons */}
              <button 
                onClick={() => {
                  if (saleScrollRef.current) {
                    saleScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button 
                onClick={() => {
                  if (saleScrollRef.current) {
                    saleScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
              
              {/* Products container - Vertical card style */}
              <div 
                ref={saleScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 cursor-grab select-none"
                onMouseDown={(e) => handleMouseDown(e, saleScrollRef)}
                onMouseLeave={() => handleMouseLeave(saleScrollRef)}
                onMouseUp={() => handleMouseUp(saleScrollRef)}
                onMouseMove={(e) => handleMouseMove(e, saleScrollRef)}
                onTouchStart={(e) => handleTouchStart(e, saleScrollRef)}
                onTouchMove={(e) => handleTouchMove(e, saleScrollRef)}
                onTouchEnd={() => handleMouseUp(saleScrollRef)}
              >
                {saleProductsToShow.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative flex-shrink-0 w-[200px] cursor-pointer"
                    onClick={() => handleProductClick(product)}
                    onMouseEnter={() => setHoveredCard(`sale-${product.id}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative bg-spotify-light-gray rounded-lg p-4 transition-all duration-300 hover:bg-gray-700">
                      {/* Product Image */}
                      <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-md shadow-lg">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-spotify-card flex items-center justify-center">
                            <span className="text-spotify-text-subdued text-4xl">🌿</span>
                          </div>
                        )}
                        
                        {/* Sale Badge */}
                        {product.compareAtPrice && product.price < product.compareAtPrice && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded font-bold">
                            SALE
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="space-y-1">
                          {product.compareAtPrice && product.price < product.compareAtPrice ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-primary font-bold text-lg">${product.price}</span>
                                <span className="text-spotify-text-subdued line-through text-sm">${product.compareAtPrice}</span>
                              </div>
                              <span className="text-primary text-xs font-bold">
                                {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-white font-semibold text-lg">${product.price}</span>
                          )}
                        </div>
                      </div>

                      {/* Hover Actions - Overlay */}
                      {hoveredCard === `sale-${product.id}` && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => handleToggleWishlist(product, e)}
                            className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                            title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart 
                              className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-white text-white' : 'text-white'}`}
                            />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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