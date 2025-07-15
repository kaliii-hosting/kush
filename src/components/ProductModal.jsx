import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Share2, TrendingUp, Award, Shield, ChevronLeft, ChevronRight, Star, Check, Truck, Clock, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { Link } from 'react-router-dom';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    product.imageUrl, // Duplicate for demo
  ];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Get random related products (exclude current product)
  const getRelatedProducts = () => {
    if (!products || products.length <= 1) return [];
    
    // Filter out current product
    const otherProducts = products.filter(p => p.id !== product.id);
    
    // Shuffle and get up to 5 products
    const shuffled = [...otherProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  };

  const relatedProducts = getRelatedProducts();

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-spotify-light-gray border-b border-spotify-card-hover z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back to Shop</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
            </button>
            <button className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors">
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-spotify-gray rounded-xl overflow-hidden mb-4 group">
              <div 
                className="aspect-square cursor-zoom-in max-w-2xl mx-auto"
                onClick={() => setShowImageZoom(true)}
              >
                <img 
                  src={images[activeImage]} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              
              {/* Image Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-spotify-green text-black text-sm font-bold px-3 py-1.5 rounded-full">
                    NEW ARRIVAL
                  </span>
                )}
                {product.isTrending && (
                  <span className="bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
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

          {/* Right Column - Product Info */}
          <div>
            {/* Product Title and Rating */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-base lg:text-lg text-spotify-text-subdued mb-4">{product.type || 'Premium Cannabis Product'}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-spotify-text-subdued">4.8 out of 5</span>
                <span className="text-spotify-text-subdued">|</span>
                <span className="text-spotify-text-subdued">324 ratings</span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl lg:text-4xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl lg:text-2xl text-spotify-text-subdued line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-spotify-gray rounded-xl p-4 lg:p-5 mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-white mb-3">Delivery & Returns</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Free Delivery</p>
                    <p className="text-spotify-text-subdued text-sm">On orders over $100. Delivery in 2-3 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Same Day Delivery</p>
                    <p className="text-spotify-text-subdued text-sm">Available in select areas. Order before 2PM.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Easy Returns</p>
                    <p className="text-spotify-text-subdued text-sm">30-day return policy. Unused products only.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="bg-spotify-gray rounded-xl p-4 lg:p-5 mb-4">
              <div className="mb-4">
                <p className="text-spotify-green font-medium mb-2">In Stock</p>
                <p className="text-spotify-text-subdued text-sm">Ships from and sold by Kushie Cannabis Co.</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-white font-medium text-sm lg:text-base">Quantity:</span>
                <div className="flex items-center bg-black rounded-lg">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-3 hover:bg-spotify-card-hover transition-colors rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                  <span className="text-white font-semibold px-6 min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-3 hover:bg-spotify-card-hover transition-colors rounded-r-lg"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-spotify-green hover:bg-spotify-green-hover text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-lg mb-3"
              >
                <ShoppingCart className="h-5 w-5" />
                {isInCart ? `Add ${quantity} More to Cart` : 'Add to Cart'}
              </button>

              {/* Buy Now Button */}
              <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-full transition-all hover:scale-[1.02] text-lg">
                Buy Now
              </button>
            </div>

            {/* Product Highlights */}
            <div className="bg-spotify-gray rounded-xl p-4 lg:p-5 mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-white mb-3">Product Highlights</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" />
                  <span className="text-spotify-text-subdued">Lab tested for purity and potency</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" />
                  <span className="text-spotify-text-subdued">Organically grown without pesticides</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" />
                  <span className="text-spotify-text-subdued">Hand-trimmed and carefully cured</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-spotify-green flex-shrink-0 mt-0.5" />
                  <span className="text-spotify-text-subdued">Sealed for maximum freshness</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-12 bg-spotify-gray rounded-xl p-6 lg:p-8">
          <div className="border-b border-spotify-card-hover mb-6">
            <div className="flex gap-8 overflow-x-auto">
              <button className="pb-4 px-1 border-b-2 border-primary text-white font-semibold whitespace-nowrap">
                Description
              </button>
              <button className="pb-4 px-1 border-b-2 border-transparent text-spotify-text-subdued hover:text-white font-semibold whitespace-nowrap transition-colors">
                Specifications
              </button>
              <button className="pb-4 px-1 border-b-2 border-transparent text-spotify-text-subdued hover:text-white font-semibold whitespace-nowrap transition-colors">
                Lab Results
              </button>
              <button className="pb-4 px-1 border-b-2 border-transparent text-spotify-text-subdued hover:text-white font-semibold whitespace-nowrap transition-colors">
                Reviews (324)
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">About This Product</h3>
              <p className="text-spotify-text-subdued leading-relaxed mb-4">
                {product.description || 'Experience premium quality with this carefully curated cannabis product. Each batch is meticulously tested for purity and potency to ensure the highest standards of quality and safety.'}
              </p>
              <p className="text-spotify-text-subdued leading-relaxed">
                Our commitment to excellence means you receive only the finest products, grown with care and processed using state-of-the-art techniques. From seed to sale, we maintain strict quality control to deliver an exceptional experience every time.
              </p>
            </div>

            {/* Product Details Grid */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between py-3 border-b border-spotify-card-hover">
                  <span className="text-spotify-text-subdued">THC Content</span>
                  <span className="text-white font-medium">{product.thc || '22%'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-spotify-card-hover">
                  <span className="text-spotify-text-subdued">CBD Content</span>
                  <span className="text-white font-medium">{product.cbd || '0.5%'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-spotify-card-hover">
                  <span className="text-spotify-text-subdued">Weight</span>
                  <span className="text-white font-medium">{product.weight || '3.5g'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-spotify-card-hover">
                  <span className="text-spotify-text-subdued">Strain Type</span>
                  <span className="text-white font-medium">{product.strain || 'Hybrid'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-spotify-card-hover">
                  <span className="text-spotify-text-subdued">Effects</span>
                  <span className="text-white font-medium">{product.effects || 'Relaxed, Happy, Euphoric'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-spotify-card-hover">
                  <span className="text-spotify-text-subdued">Flavor Profile</span>
                  <span className="text-white font-medium">{product.flavor || 'Sweet, Earthy, Citrus'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Customers Also Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="bg-spotify-gray rounded-lg p-4 hover:bg-spotify-card-hover transition-colors cursor-pointer group"
                  onClick={() => {
                    // Close current modal and open new one with related product
                    onClose();
                    setTimeout(() => {
                      // This would need to be handled by parent component
                      window.location.href = `/shop?product=${relatedProduct.id}`;
                    }, 300);
                  }}
                >
                  <div className="relative aspect-square bg-black rounded-lg mb-3 overflow-hidden">
                    {relatedProduct.imageUrl ? (
                      <img 
                        src={relatedProduct.imageUrl} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-spotify-gray to-black" />
                    )}
                    
                    {/* Quick add to cart on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(relatedProduct);
                        }}
                        className="bg-spotify-green hover:bg-spotify-green-hover text-black rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">{relatedProduct.name}</h4>
                  <p className="text-primary font-bold">${relatedProduct.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {showImageZoom && (
        <div className="fixed inset-0 bg-black z-60 flex items-center justify-center p-4" onClick={() => setShowImageZoom(false)}>
          <img 
            src={images[activeImage]} 
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setShowImageZoom(false)}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductModal;