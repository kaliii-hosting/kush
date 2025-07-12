import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Share2, TrendingUp, Award, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen || !product) return null;

  // Check if product is in cart
  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    if (isInCart) {
      updateQuantity(product.id, cartItem.quantity + quantity);
    } else {
      addToCart(product, quantity);
    }
    setQuantity(1);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Generate multiple images for demo
  const images = [
    product.imageUrl,
    product.imageUrl, // Duplicate for demo
    product.imageUrl, // Duplicate for demo
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div 
          className="relative bg-spotify-light-gray rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-4xl lg:max-w-5xl h-[95vh] sm:h-[90vh] md:h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <div className="grid md:grid-cols-2 h-full overflow-hidden">
              {/* Product Images */}
              <div className="bg-black p-4 sm:p-6 lg:p-8 flex flex-col h-full md:h-auto overflow-y-auto md:overflow-visible">
                <div className="relative aspect-square bg-spotify-gray rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 flex-shrink-0">
                  <img 
                    src={images[activeImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-spotify-green text-black text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {product.isTrending && (
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-2 justify-center flex-shrink-0">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col overflow-y-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{product.name}</h1>
                  <p className="text-spotify-text-subdued">{product.type || 'Premium Cannabis'}</p>
                  
                  <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-spotify-text-subdued line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 flex-1 overflow-y-auto">
                  <div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Description</h3>
                    <p className="text-spotify-text-subdued text-sm sm:text-base">
                      {product.description || 'Experience premium quality with this carefully curated product. Each batch is tested for purity and potency to ensure the highest standards.'}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="hidden sm:block">
                    <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Key Features</h3>
                    <ul className="space-y-1 sm:space-y-2">
                      <li className="flex items-center gap-2 text-spotify-text-subdued text-sm sm:text-base">
                        <Shield className="h-4 w-4 text-spotify-green" />
                        Lab tested for quality and safety
                      </li>
                      <li className="flex items-center gap-2 text-spotify-text-subdued text-sm sm:text-base">
                        <Award className="h-4 w-4 text-spotify-green" />
                        Premium grade product
                      </li>
                      <li className="flex items-center gap-2 text-spotify-text-subdued text-sm sm:text-base">
                        <TrendingUp className="h-4 w-4 text-spotify-green" />
                        Customer favorite
                      </li>
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 py-3 sm:py-4 border-t border-spotify-card-hover">
                    <div>
                      <span className="text-spotify-text-subdued text-xs sm:text-sm">THC Content</span>
                      <p className="text-white font-semibold text-sm sm:text-base">{product.thc || '22%'}</p>
                    </div>
                    <div>
                      <span className="text-spotify-text-subdued text-xs sm:text-sm">Weight</span>
                      <p className="text-white font-semibold text-sm sm:text-base">{product.weight || '3.5g'}</p>
                    </div>
                    <div>
                      <span className="text-spotify-text-subdued text-xs sm:text-sm">Strain Type</span>
                      <p className="text-white font-semibold text-sm sm:text-base">{product.strain || 'Hybrid'}</p>
                    </div>
                    <div>
                      <span className="text-spotify-text-subdued text-xs sm:text-sm">Effects</span>
                      <p className="text-white font-semibold text-sm sm:text-base">{product.effects || 'Relaxed'}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 sm:space-y-4 flex-shrink-0">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-white font-semibold text-sm sm:text-base">Quantity:</span>
                    <div className="flex items-center gap-2 bg-spotify-gray rounded-full">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4 text-white" />
                      </button>
                      <span className="text-white font-semibold px-4 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-spotify-green hover:bg-spotify-green-hover text-black font-bold py-3 sm:py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 text-sm sm:text-base"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    {isInCart ? `Add ${quantity} More to Cart` : 'Add to Cart'}
                  </button>

                  {/* Secondary Actions */}
                  <div className="flex gap-3 sm:gap-4">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`flex-1 py-2.5 sm:py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                        isFavorite 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'border-2 border-spotify-card-hover text-white hover:border-white'
                      }`}
                    >
                      <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                      <span className="sm:hidden">{isFavorite ? 'Saved' : 'Save'}</span>
                    </button>
                    <button className="p-2.5 sm:p-3 border-2 border-spotify-card-hover rounded-full hover:border-white transition-colors">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default ProductModal;