import { Link } from 'react-router-dom';
import { Play, MoreHorizontal, ShoppingCart, TrendingUp, Sparkles, Award, Heart, Eye, Clock, Shuffle, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useState, useRef } from 'react';
import ProductModal from './ProductModal';

const SpotifyHome = () => {
  const { products } = useProducts();
  const { addToCart, cart } = useCart();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };
  
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleProductClick = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };
  
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };


  // Organize products by category
  const featured = products.slice(0, 6);
  const popular = products.slice(6, 11);
  const newArrivals = products.slice(11, 16);
  const recommended = products.slice(0, 5);
  const trending = products.slice(5, 12);

  return (
    <div>
      {/* Hero Section with Video Background */}
      <div className="relative h-[85vh] -mt-16 mb-8 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01//background%20real.mp4" type="video/mp4" />
        </video>
        
        {/* Multiple Gradient Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Clean hero with just video */}
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-[1800px] mx-auto">
        {/* Greeting with Spotify-style time indicator */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{getGreeting()}</h1>
          <div className="flex items-center gap-2 text-spotify-text-subdued">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

      {/* Quick picks grid - Spotify style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-12">
        {featured.map((product, index) => (
          <Link
            key={product.id}
            to="/shop"
            className="bg-spotify-light-gray/60 rounded flex items-center gap-3 pr-3 hover:bg-spotify-card-hover transition-all duration-200 group overflow-hidden relative"
          >
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-primary rounded-full p-3 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product, e);
                }}
              >
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-dark/20 flex-shrink-0">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{product.name}</p>
              <p className="text-xs text-spotify-text-subdued truncate">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mini Hero Section 4 - Gold Cartridges */}
      <div className="relative h-[50vh] -mx-8 mb-12 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/videos/Gold%20Cartridges%20Video.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center text-center px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-500 font-semibold mb-4">
              Premium Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Gold Standard Cartridges
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Experience luxury with our gold series - pure, potent, and perfectly crafted.
            </p>
            <Link
              to="/shop?collection=gold"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-3 text-base font-bold text-black hover:from-yellow-600 hover:to-yellow-700 transition-colors"
            >
              Discover Gold Series
            </Link>
          </div>
        </div>
      </div>

      {/* Popular right now */}
      <Section
        title="Popular right now"
        subtitle="The most popular products in your area"
        items={popular}
        showAll="/shop?filter=popular"
      />

      {/* Mini Hero Section 3 - Disposables Collection */}
      <div className="relative h-[55vh] -mx-8 mb-12 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/videos/Dspsbls%20NeoGreen%20Video.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-end px-8">
          <div className="max-w-2xl text-right">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Disposables Redefined
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Premium disposable vapes with cutting-edge technology and exceptional flavors.
            </p>
            <div className="flex gap-4 justify-end">
              <Link
                to="/shop?category=disposables"
                className="inline-flex items-center gap-2 rounded-full bg-spotify-green px-6 py-3 text-base font-semibold text-black hover:bg-spotify-green-hover transition-colors"
              >
                <Sparkles className="h-5 w-5" />
                Shop Disposables
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* New arrivals */}
      <Section
        title="New arrivals"
        subtitle="Fresh products just added to our collection"
        items={newArrivals}
        showAll="/shop?filter=new"
      />

      {/* Made for you */}
      <Section
        title="Made for you"
        subtitle="Based on your recent activity"
        items={recommended}
        showAll="/shop?filter=recommended"
      />

      {/* Mini Hero Section 1 - Premium Experience */}
      <div className="relative h-[60vh] -mx-8 mb-12 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01//background%20video%201.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        {/* Content */}
        <div className="relative h-full flex items-center px-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Experience Premium Quality
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Discover our exclusive collection of artisanal cannabis products, crafted with precision and care.
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                <Play className="h-5 w-5 fill-white" />
                Explore Collection
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white hover:text-black transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recently viewed */}
      <Section
        title="Recently viewed"
        subtitle="Pick up where you left off"
        items={products.slice(0, 5)}
        showAll="/recent"
      />


      {/* Trending Products Carousel - Spotify Style */}
      <div className="mb-12 -mx-4 md:-mx-8">
        <div className="flex items-baseline justify-between mb-6 px-4 md:px-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 hover:underline cursor-pointer">
              <div className="bg-gradient-to-r from-primary to-primary-hover p-2 rounded">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Trending Now
            </h2>
            <p className="text-sm text-spotify-text-subdued mt-1">Most popular products this week</p>
          </div>
          <Link to="/shop?filter=trending" className="text-sm font-semibold text-spotify-text-subdued hover:text-white transition-colors hover:underline">
            See trending playlist
          </Link>
        </div>
        
        <div className="relative">
          <div className="flex animate-infinite-scroll">
            {/* First set of products */}
            <div className="flex gap-4 px-8">
              {trending.map((product, index) => (
                <div
                  key={`trending-1-${product.id}`}
                  className="group relative flex-shrink-0 w-64"
                  onMouseEnter={() => setHoveredCard(`trending-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                <div className="bg-card rounded-lg p-4 transition-all duration-300 hover:bg-card-hover hover:scale-105 hover:shadow-xl">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    {/* Trending Badge */}
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Trending
                    </div>
                    
                    {/* Quick Actions */}
                    <div className={`absolute bottom-2 right-2 flex gap-2 transition-all duration-300 ${
                      hoveredCard === `trending-${index}` ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Eye className="h-4 w-4 text-black" />
                      </button>
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Heart className="h-4 w-4 text-black" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-white mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`rounded-full p-2 transition-all hover:scale-110 ${
                        isInCart(product.id)
                          ? 'bg-white hover:bg-gray-100'
                          : 'bg-primary hover:bg-primary-hover'
                      }`}
                    >
                      <ShoppingCart className={`h-4 w-4 ${
                        isInCart(product.id) ? 'text-black' : 'text-white'
                      }`} fill={isInCart(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-4 px-8" aria-hidden="true">
              {trending.map((product, index) => (
                <div
                  key={`trending-2-${product.id}`}
                  className="group relative flex-shrink-0 w-64"
                >
                <div className="bg-card rounded-lg p-4 transition-all duration-300 hover:bg-card-hover hover:scale-105 hover:shadow-xl">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    {/* Trending Badge */}
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Trending
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 transition-all duration-300">
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Eye className="h-4 w-4 text-black" />
                      </button>
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Heart className="h-4 w-4 text-black" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-white mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`rounded-full p-2 transition-all hover:scale-110 ${
                        isInCart(product.id)
                          ? 'bg-white hover:bg-gray-100'
                          : 'bg-primary hover:bg-primary-hover'
                      }`}
                    >
                      <ShoppingCart className={`h-4 w-4 ${
                        isInCart(product.id) ? 'text-black' : 'text-white'
                      }`} fill={isInCart(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Hero Section 2 - Innovation Spotlight */}
      <div className="relative h-[50vh] -mx-8 mb-12 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01//background%20video%202.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center text-center px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary font-semibold mb-4">
              New Innovation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Future of Cannabis is Here
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Cutting-edge extraction methods and innovative delivery systems for the ultimate experience.
            </p>
            <Link
              to="/shop?filter=new"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-bold text-black hover:bg-gray-100 transition-colors"
            >
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Awards & Recognition - Spotify Style */}
      <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-spotify-light-gray to-spotify-light-gray p-8 group">
        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-full shadow-xl">
                <Award className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white">Award-Winning Quality</h2>
            </div>
            <p className="text-spotify-text-subdued mb-6 leading-relaxed">
              Recognized for excellence in cultivation, processing, and customer satisfaction.
              Our commitment to quality has earned us numerous industry accolades.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { title: 'Best Product', award: '2024 Cannabis Cup', icon: '🏆' },
                { title: 'Excellence Award', award: 'Industry Leader', icon: '⭐' },
                { title: 'Top Rated', award: 'Customer Choice', icon: '❤️' }
              ].map((item, index) => (
                <div key={index} className="bg-black/30 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 hover:border-primary/50 transition-all hover:scale-105">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-xs text-spotify-text-subdued">{item.title}</p>
                  </div>
                  <p className="font-bold text-white">{item.award}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Award winning products showcase */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary/30">
                  {featured[0]?.imageUrl && (
                    <img 
                      src={featured[0].imageUrl} 
                      alt={featured[0].name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                  Winner
                </div>
              </div>
              <p className="text-white font-semibold mt-4">{featured[0]?.name}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

// Section component with Spotify styling
const Section = ({ title, subtitle, items, showAll }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12 relative group">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">{title}</h2>
          {subtitle && <p className="text-sm text-spotify-text-subdued mt-1">{subtitle}</p>}
        </div>
        {showAll && (
          <Link to={showAll} className="text-sm font-semibold text-spotify-text-subdued hover:text-white transition-colors hover:underline">
            Show all
          </Link>
        )}
      </div>
      
      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-spotify-light-gray/90 backdrop-blur-sm rounded-full p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 -translate-x-4 group-hover:translate-x-0"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-spotify-light-gray/90 backdrop-blur-sm rounded-full p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 translate-x-4 group-hover:translate-x-0"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
        
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
        >
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Product card component with Spotify styling
const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };
  
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <Link
      to="/shop"
      className="flex-shrink-0 w-[180px] md:w-[200px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-spotify-light-gray p-4 rounded-lg hover:bg-spotify-card-hover transition-all duration-300 group cursor-pointer">
        <div className="relative mb-4">
          <div className="aspect-square bg-spotify-gray rounded-md overflow-hidden shadow-lg">
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Spotify-style play/cart button */}
          <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button 
              onClick={(e) => handleAddToCart(product, e)}
              className={`rounded-full p-3 shadow-2xl hover:scale-110 transition-all ${
                isInCart(product.id)
                  ? 'bg-white text-black'
                  : 'bg-spotify-green text-black hover:bg-spotify-green-hover'
              }`}
            >
              {isInCart(product.id) ? (
                <ShoppingCart className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
              )}
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-sm text-spotify-text-subdued">${product.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default SpotifyHome;

/* Add these styles to your global CSS or create a new CSS module */
const styles = `
  @keyframes scroll-slow {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  .animate-scroll-slow {
    animation: scroll-slow 30s linear infinite;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`;