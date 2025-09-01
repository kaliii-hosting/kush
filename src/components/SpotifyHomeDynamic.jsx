import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, ShoppingCart, Heart, ChevronDown, Leaf, Zap, Shirt } from 'lucide-react';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { useCart } from '../context/ShopifyCartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductModal from './ProductModal';
import ProductHoverActions from './ProductHoverActions';
import InfiniteProductSlider from './InfiniteProductSlider';

const SpotifyHomeDynamic = ({ onCartClick }) => {
  const navigate = useNavigate();
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

  // State for featured product carousel
  const [featuredProductIndex, setFeaturedProductIndex] = useState(0);
  
  // State for poster image slider
  const [posterSliderIndex, setPosterSliderIndex] = useState(0);
  const posterImages = [
    'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Posters/flower%20poster%202.jpg',
    'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Posters/dspsbls%20poster.jpg',
    'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Posters/flower%20poster.jpg'
  ];
  
  // Auto-advance poster slider
  useEffect(() => {
    const interval = setInterval(() => {
      setPosterSliderIndex((prev) => (prev + 1) % posterImages.length);
    }, 4000); // Change image every 4 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Find clothing products from sale items for hero section
  const featuredClothingProducts = saleProducts.filter(product => {
    // Check if it's a clothing item
    const isClothing = 
      product.productType?.toLowerCase().includes('apparel') ||
      product.productType?.toLowerCase().includes('clothing') ||
      product.productType?.toLowerCase().includes('shirt') ||
      product.productType?.toLowerCase().includes('hoodie') ||
      product.productType?.toLowerCase().includes('gear') ||
      product.tags?.some(tag => 
        typeof tag === 'string' && (
          tag.toLowerCase().includes('apparel') ||
          tag.toLowerCase().includes('clothing') ||
          tag.toLowerCase().includes('shirt') ||
          tag.toLowerCase().includes('hoodie') ||
          tag.toLowerCase().includes('gear')
        )
      );
    return isClothing;
  });

  // Use all sale products if no clothing found
  const productsForHero = featuredClothingProducts.length > 0 ? featuredClothingProducts : saleProductsToShow;
  const featuredClothingProduct = productsForHero[featuredProductIndex] || productsForHero[0];

  // Navigate between products
  const nextProduct = () => {
    setFeaturedProductIndex((prev) => (prev + 1) % productsForHero.length);
  };

  const prevProduct = () => {
    setFeaturedProductIndex((prev) => (prev - 1 + productsForHero.length) % productsForHero.length);
  };

  // Handle product interactions
  const handleProductClick = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Navigate to shop page with product selected to open modal
    navigate(`/shop?product=${product.handle || product.id}`);
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
        
        {/* Cinematic gradient overlay - Spotify style */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Additional bottom fade for enhanced cinematic effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
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
              to="/wholesale" 
              className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Disposables Poster Image Section */}
      <section className="relative bg-black py-8" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
        <img 
          src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Posters/dspsbls%20poster2.jpg"
          alt="Premium Disposables Collection"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            maxHeight: '100vh',
            objectFit: 'contain',
            backgroundColor: 'black'
          }}
        />
      </section>

      {/* Premium Clothing Hero Section - Professional Animated Design */}
      {featuredClothingProduct && (
        <section 
          className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-black py-8 cursor-pointer"
          onClick={(e) => {
            // Only trigger if not clicking on buttons
            if (!e.target.closest('button') && !e.target.closest('a')) {
              handleProductClick(featuredClothingProduct, e);
            }
          }}
        >
          {/* Background with specific image */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/SHOP_BANNER_2f58ad04-18a3-4e1b-8d2a-acd93acef73d.webp)`,
                filter: 'brightness(0.3)'
              }}
            />
          </div>
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/30" />
          
          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 gap-4 md:gap-8 items-center">
                
                {/* Left Content - Text and CTA */}
                <div className="space-y-3 md:space-y-4 text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30 animate-pulse-subtle">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-primary text-xs font-medium uppercase tracking-wider">Limited Time Offer</span>
                  </div>
                  
                  {/* Main Heading */}
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      <span className="animate-text-reveal-1">Premium</span>{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 animate-text-reveal-2">
                        Streetwear
                      </span>{' '}
                      <span className="animate-text-reveal-3">Collection</span>
                    </h1>
                    
                    <p className="text-sm md:text-base text-gray-300 max-w-md animate-fade-in opacity-0 animation-delay-500">
                      Elevate your style with our exclusive hemp-infused apparel line
                    </p>
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-2 animate-fade-in opacity-0 animation-delay-700">
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      {featuredClothingProduct.title || featuredClothingProduct.name || 'Featured Product'}
                    </h2>
                    
                    {/* Price Display */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl md:text-2xl font-bold text-primary">
                        ${featuredClothingProduct.price || '0.00'}
                      </span>
                      {featuredClothingProduct.compareAtPrice && (
                        <>
                          <span className="text-base md:text-lg text-gray-500 line-through">
                            ${featuredClothingProduct.compareAtPrice}
                          </span>
                          <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-full animate-bounce-subtle">
                            {Math.round(((featuredClothingProduct.compareAtPrice - featuredClothingProduct.price) / featuredClothingProduct.compareAtPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="flex gap-3 animate-fade-in opacity-0 animation-delay-900">
                    <button
                      onClick={(e) => handleAddToCart(featuredClothingProduct, e)}
                      className="group relative px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 overflow-hidden text-sm"
                    >
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Right Content - Product Image Showcase */}
                <div className="relative h-full min-h-[300px] animate-fade-in-left opacity-0 animation-delay-300">
                  {/* Navigation Arrows */}
                  {productsForHero.length > 1 && (
                    <>
                      <button
                        onClick={prevProduct}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
                      >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={nextProduct}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
                      >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" />
                      </button>
                    </>
                  )}
                  
                  <div 
                    className="h-full bg-gradient-to-t from-black/50 to-transparent rounded-xl overflow-hidden shadow-xl"
                  >
                    {(featuredClothingProduct.images?.[0]?.src || featuredClothingProduct.image || featuredClothingProduct.images?.[0]) ? (
                      <img
                        src={featuredClothingProduct.images?.[0]?.src || featuredClothingProduct.image || featuredClothingProduct.images?.[0]}
                        alt={featuredClothingProduct.title || 'Featured Product'}
                        className="w-full h-full object-contain md:object-cover transform hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-gray-800', 'to-gray-900');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <Shirt className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Product Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-24 md:w-32 h-24 md:h-32 bg-primary/20 rounded-full blur-3xl animate-float hidden lg:block"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 md:w-40 h-32 md:h-40 bg-orange-500/20 rounded-full blur-3xl animate-float-delayed hidden lg:block"></div>
                  
                  {/* Sale Badge */}
                  {featuredClothingProduct.compareAtPrice && (
                    <div className="absolute top-4 md:top-8 right-4 md:right-8 bg-primary text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-2xl animate-bounce-subtle">
                      SALE
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </section>
      )}

      {/* Sale Products Slider Section */}
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

      {/* Live Resin Poster Image Section */}
      <section className="relative bg-black py-8" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
        <img 
          src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Posters/live%20resin%20poster.jpg"
          alt="Live Resin Collection"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            maxHeight: '100vh',
            objectFit: 'contain',
            backgroundColor: 'black'
          }}
        />
      </section>

      {/* Apple-Style Layout Section */}
      <section className="bg-gray-100 py-8">
        {/* Top Hero Banner - iPhone Style */}
        <div className="relative bg-gray-100 py-8 md:py-16 text-center overflow-hidden">
          {/* Animated Neon Orange Equalizer Background */}
          <div className="absolute inset-0 flex items-end justify-center opacity-20">
            <div className="flex gap-1 w-full h-full items-end">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-orange-500 via-orange-400 to-transparent animate-equalizer"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    height: '100%'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">
              Experience the Live Resin Diamonds Disposables
            </h2>
            <p className="text-lg md:text-xl text-gray-800/90 mb-6 max-w-2xl mx-auto">
              Experience the Live Resin Diamonds Disposables
            </p>
            <div className="flex gap-4 justify-center mb-8">
              <Link to="/shop?category=hemp" className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Shop THCa
              </Link>
            </div>
            <div className="relative h-[400px] overflow-hidden">
              <img 
                src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/Pictures/Orange_jack_1754117120607_6og7yp0.png" 
                alt="Orange Jack (Sativa) DSPSBLS+ 3G"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ transform: 'translateX(3%)' }}
              />
            </div>
          </div>
        </div>

      </section>

      {/* Premium Hemp Collection Slider Section */}
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

      {/* Auto-Looped Poster Image Slider Section */}
      <section className="relative bg-black overflow-hidden py-8" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
        <div className="relative w-full">
          {/* Image Container with Transition */}
          {posterImages.map((image, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === posterSliderIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              <img 
                src={image}
                alt={`Collection Poster ${index + 1}`}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100vh',
                  objectFit: 'contain',
                  backgroundColor: 'black'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {posterImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setPosterSliderIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === posterSliderIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setPosterSliderIndex((prev) => (prev - 1 + posterImages.length) % posterImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => setPosterSliderIndex((prev) => (prev + 1) % posterImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
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