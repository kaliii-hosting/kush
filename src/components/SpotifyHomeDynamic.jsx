import { Link } from 'react-router-dom';
import { Play, MoreHorizontal, ShoppingCart, TrendingUp, Sparkles, Award, Heart, Eye, Clock, Shuffle, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { useCart } from '../context/ShopifyCartContext';
import { usePageContent } from '../context/PageContentContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useRef } from 'react';
import ProductModal from './ProductModal';
import ProductHoverActions from './ProductHoverActions';
import DynamicSection from './DynamicSection';

const SpotifyHomeDynamic = ({ onCartClick }) => {
  const { shopifyProducts } = useEnhancedProducts();
  const { addToCart, cart } = useCart();
  const { pageContent } = usePageContent();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [hoveredQuickPick, setHoveredQuickPick] = useState(null);
  
  // Get homepage sections
  const sections = pageContent?.home?.sections || [];
  
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

  // Organize products by category - Get 10 products for each section (using only Shopify products)
  const featured = shopifyProducts.slice(0, 6);
  const popular = shopifyProducts.slice(0, 10);
  const newArrivals = shopifyProducts.slice(5, 15);
  const trending = shopifyProducts.slice(0, 10);
  const madeForYou = shopifyProducts.slice(3, 13);

  // Render product sections between dynamic sections
  const renderProductSection = (products, title, subtitle, icon = null) => {
    const scrollRef = useRef(null);
    
    const scrollLeft = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
    };
    
    const scrollRight = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    };

    return (
      <div className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {icon}
              {title}
            </h2>
            {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
          </div>
          <Link to="/shop" className="text-text-secondary hover:text-white text-sm font-medium uppercase tracking-wider transition-colors">
            Show all
          </Link>
        </div>
        
        <div className="relative group">
          {/* Scroll buttons */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
          
          {/* Products scroll container */}
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex-shrink-0 w-[200px] cursor-pointer"
                onClick={() => handleProductClick(product)}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-card rounded-lg p-4 transition-all duration-300 hover:bg-card-hover">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    <ProductHoverActions 
                      product={product}
                      isHovered={hoveredCard === product.id}
                      onProductClick={() => handleProductClick(product)}
                    />
                  </div>
                  
                  <h3 className="font-medium text-white mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-text-secondary text-sm">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-0">
      {/* Render all sections in order */}
      {sections.map((section, index) => (
        <DynamicSection 
          key={section.id} 
          section={section}
          isFirstSection={index === 0}
          onCartClick={onCartClick}
        />
      ))}

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