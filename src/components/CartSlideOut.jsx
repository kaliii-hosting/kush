import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, ExternalLink } from 'lucide-react';
import { useCart } from '../context/ShopifyCartContext';
import { Link } from 'react-router-dom';
import ShopifyCheckoutButton from './ShopifyCheckoutButton';

const CartSlideOut = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Cart Slide-out */}
      <div 
        className={`fixed right-0 top-0 h-[calc(100vh-3rem)] sm:h-[calc(100vh-5rem)] w-full sm:w-96 bg-black border-l border-border z-[60] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              {cartCount > 0 && (
                <span className="bg-primary text-white text-sm font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-dark rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <ShoppingCart className="h-16 w-16 text-gray mb-4" />
                <p className="text-white text-lg font-bold mb-2">Your cart is empty</p>
                <p className="text-text-secondary text-sm text-center mb-6">
                  Add some products to get started
                </p>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-hover transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.lineItemId || item.id} className="bg-card rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-dark rounded-md overflow-hidden flex-shrink-0">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title || item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">
                          {item.title || item.name}
                        </h3>
                        {item.variantTitle && item.variantTitle !== 'Default Title' && (
                          <p className="text-text-secondary text-xs mb-1">{item.variantTitle}</p>
                        )}
                        <p className="text-primary font-bold mb-2">${item.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(
                              item.id, 
                              item.quantity - 1, 
                              !item.isFirebaseProduct, 
                              item.lineItemId
                            )}
                            className="w-8 h-8 rounded-full bg-gray-dark hover:bg-gray flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4 text-white" />
                          </button>
                          <span className="text-white font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(
                              item.id, 
                              item.quantity + 1, 
                              !item.isFirebaseProduct, 
                              item.lineItemId
                            )}
                            className="w-8 h-8 rounded-full bg-gray-dark hover:bg-gray flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4 text-white" />
                          </button>
                          <button
                            onClick={() => removeFromCart(
                              item.id, 
                              !item.isFirebaseProduct, 
                              item.lineItemId
                            )}
                            className="ml-auto text-text-secondary hover:text-white text-sm transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white text-lg font-bold">Total</span>
                <span className="text-primary text-2xl font-black">${cartTotal}</span>
              </div>
              
              <div className="space-y-3">
                <ShopifyCheckoutButton 
                  fullWidth
                  text="Proceed to Checkout"
                  className="text-lg"
                />
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="block w-full text-center text-white font-bold py-4 rounded-full border-2 border-white hover:bg-white/10 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSlideOut;