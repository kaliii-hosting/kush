import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Share2, TrendingUp, Award, Shield, ChevronLeft, ChevronRight, Star, Check, Truck, Clock, RotateCcw, BookmarkCheck, Tag } from 'lucide-react';
import { useCart } from '../context/ShopifyCartContext';
import { useWishlist } from '../context/WishlistContext';
import { useEnhancedProducts } from '../context/EnhancedProductsContext';
import { Link } from 'react-router-dom';
import CartSlideOut from './CartSlideOut';
import WishlistSlideOut from './WishlistSlideOut';
import ProductVariantSelector from './ProductVariantSelector';

const ProductModal = ({ product, isOpen, onClose, onCartClick }) => {
  const { addToCart, cart, updateQuantity, cartCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { products } = useEnhancedProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCartSlideOut, setShowCartSlideOut] = useState(false);
  const [showWishlistSlideOut, setShowWishlistSlideOut] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);

  // Update selected variant when product changes
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

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

  const handleAddToCart = async () => {
    try {
      if (product.source === 'shopify') {
        // For Shopify products, add the selected variant
        const variantToAdd = selectedVariant || product.variants?.[0];
        if (variantToAdd) {
          await addToCart({ ...product, selectedVariantId: variantToAdd.id }, quantity);
        }
      } else {
        // For Firebase products, add as normal
        await addToCart(product, quantity);
      }
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Get product images
  const images = product.source === 'shopify' && product.images?.length > 0
    ? product.images
    : [product.imageUrl || '/placeholder.jpg'];

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

  // Handle cart click
  const handleCartClick = () => {
    setShowCartSlideOut(true);
  };

  // Handle wishlist click
  const handleWishlistClick = () => {
    setShowWishlistSlideOut(true);
  };

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing ${product.type || 'cannabis product'}: ${product.name}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to custom share modal
        setShowShareModal(true);
      }
    } catch (error) {
      console.log('Share failed:', error);
      // Fallback to custom share modal
      setShowShareModal(true);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

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
            {/* Cart Button */}
            <button 
              onClick={handleCartClick}
              className="relative p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
              title="View Cart"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            
            {/* Wishlist Toggle Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
              title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-white'}`} />
            </button>
            
            {/* Wishlist Navigation Button */}
            <button
              onClick={handleWishlistClick}
              className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
              title="View Wishlist"
            >
              <BookmarkCheck className="h-5 w-5 text-white" />
            </button>
            
            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
              title="Share Product"
            >
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
            {/* Mobile Product Info - Show only on mobile */}
            <div className="lg:hidden mb-4">
              <h1 className="text-xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-sm text-spotify-text-subdued mb-3">{product.type || 'Premium Cannabis Product'}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-spotify-text-subdued text-sm">4.8 (324)</span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">
                  ${selectedVariant?.price || product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-spotify-text-subdued line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>
            
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
            {/* Product Title and Rating - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block mb-6">
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
                <span className="text-3xl lg:text-4xl font-bold text-primary">
                  ${selectedVariant?.price || product.price}
                </span>
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
                <p className="text-spotify-text-subdued text-sm">
                  {product.source === 'shopify' ? `Ships from ${product.vendor || 'Kushie Store'}` : 'Ships from and sold by Kushie Cannabis Co.'}
                </p>
              </div>

              {/* Variant Selector for Shopify Products */}
              {product.source === 'shopify' && product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <ProductVariantSelector 
                    product={product}
                    selectedVariant={selectedVariant}
                    onVariantSelect={setSelectedVariant}
                  />
                </div>
              )}

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

          </div>
        </div>

        {/* Product Highlights - Full Width */}
        <div className="mt-8 bg-spotify-gray rounded-xl p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-semibold text-white mb-6">Product Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-spotify-green flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-medium mb-1">Lab Tested</h4>
                <span className="text-spotify-text-subdued text-sm">Purity and potency verified</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-spotify-green flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-medium mb-1">Organic</h4>
                <span className="text-spotify-text-subdued text-sm">Grown without pesticides</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-spotify-green flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-medium mb-1">Hand-Trimmed</h4>
                <span className="text-spotify-text-subdued text-sm">Carefully cured for quality</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-spotify-green flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-medium mb-1">Fresh Sealed</h4>
                <span className="text-spotify-text-subdued text-sm">Maximum freshness guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="mt-12 bg-spotify-gray rounded-xl p-6 lg:p-8">
          <div className="border-b border-spotify-card-hover mb-6">
            <div className="flex gap-8 overflow-x-auto">
              <button className="pb-4 px-1 border-b-2 border-primary text-white font-semibold whitespace-nowrap">
                Description
              </button>
              <button className="pb-4 px-1 border-b-2 border-transparent text-spotify-text-subdued hover:text-white font-semibold whitespace-nowrap transition-colors">
                Lab Results
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
          <div className="bg-spotify-light-gray rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Share Product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-spotify-text-subdued text-sm mb-2">Product Link</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 bg-spotify-gray text-white px-3 py-2 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => {
                      copyToClipboard(window.location.href);
                      setShowShareModal(false);
                    }}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-spotify-text-subdued text-sm mb-3">Share via</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const text = `Check out ${product.name} - ${window.location.href}`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                      setShowShareModal(false);
                    }}
                    className="bg-spotify-gray hover:bg-spotify-card-hover text-white p-3 rounded-lg transition-colors text-sm font-medium"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                      setShowShareModal(false);
                    }}
                    className="bg-spotify-gray hover:bg-spotify-card-hover text-white p-3 rounded-lg transition-colors text-sm font-medium"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => {
                      const text = `Check out ${product.name}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} - ${window.location.href}`)}`, '_blank');
                      setShowShareModal(false);
                    }}
                    className="bg-spotify-gray hover:bg-spotify-card-hover text-white p-3 rounded-lg transition-colors text-sm font-medium"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      const subject = `Check out ${product.name}`;
                      const body = `I found this amazing product: ${product.name}\n\n${window.location.href}`;
                      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                      setShowShareModal(false);
                    }}
                    className="bg-spotify-gray hover:bg-spotify-card-hover text-white p-3 rounded-lg transition-colors text-sm font-medium"
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Slide-out */}
      <CartSlideOut 
        isOpen={showCartSlideOut} 
        onClose={() => setShowCartSlideOut(false)} 
      />

      {/* Wishlist Slide-out */}
      <WishlistSlideOut 
        isOpen={showWishlistSlideOut} 
        onClose={() => setShowWishlistSlideOut(false)} 
      />
    </div>
  );
};

export default ProductModal;