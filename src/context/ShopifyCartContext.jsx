import React, { createContext, useContext, useEffect, useState } from 'react';
import { useShopify } from './ShopifyContext';
import { useEnhancedProducts } from './EnhancedProductsContext';

const ShopifyCartContext = createContext();

export const useCart = () => {
  const context = useContext(ShopifyCartContext);
  if (!context) {
    throw new Error('useCart must be used within a ShopifyCartProvider');
  }
  return context;
};

export const ShopifyCartProvider = ({ children }) => {
  const { 
    addToCart: shopifyAddToCart, 
    removeFromCart: shopifyRemoveFromCart,
    updateCartItem: shopifyUpdateCartItem,
    clearCart: shopifyClearCart,
    getCartItems,
    getCartCount,
    getCartTotal,
    isInCart: shopifyIsInCart,
    getCheckoutUrl,
    checkout,
    cartLoading
  } = useShopify();

  const { firebaseProducts } = useEnhancedProducts();
  const [localCart, setLocalCart] = useState([]); // For Firebase products
  const [isOpen, setIsOpen] = useState(false);

  // Load local cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('firebase_cart');
    if (savedCart) {
      setLocalCart(JSON.parse(savedCart));
    }
  }, []);

  // Save local cart to localStorage
  useEffect(() => {
    localStorage.setItem('firebase_cart', JSON.stringify(localCart));
  }, [localCart]);

  // Add to cart (handles both Firebase and Shopify products)
  const addToCart = async (product, quantity = 1) => {
    if (product.source === 'shopify') {
      // For Shopify products, use the first variant if no specific variant is selected
      const variantId = product.selectedVariantId || product.variants[0]?.id;
      if (variantId) {
        await shopifyAddToCart(variantId, quantity);
      }
    } else {
      // For Firebase products, add to local cart
      const existingItem = localCart.find(item => item.id === product.id);
      if (existingItem) {
        setLocalCart(prev => 
          prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setLocalCart(prev => [...prev, { ...product, quantity }]);
      }
    }
  };

  // Remove from cart
  const removeFromCart = async (productId, isShopifyProduct = false, lineItemId = null) => {
    if (isShopifyProduct && lineItemId) {
      await shopifyRemoveFromCart(lineItemId);
    } else {
      setLocalCart(prev => prev.filter(item => item.id !== productId));
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity, isShopifyProduct = false, lineItemId = null) => {
    if (quantity <= 0) {
      await removeFromCart(productId, isShopifyProduct, lineItemId);
      return;
    }

    if (isShopifyProduct && lineItemId) {
      await shopifyUpdateCartItem(lineItemId, quantity);
    } else {
      setLocalCart(prev => 
        prev.map(item => 
          item.id === productId 
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    await shopifyClearCart();
    setLocalCart([]);
  };

  // Get all cart items (both Firebase and Shopify)
  const getAllCartItems = () => {
    const shopifyItems = getCartItems();
    const firebaseItems = localCart.map(item => ({
      ...item,
      isFirebaseProduct: true,
      lineItemId: null
    }));
    
    return [...firebaseItems, ...shopifyItems];
  };

  // Get total cart count
  const getTotalCartCount = () => {
    const shopifyCount = getCartCount();
    const firebaseCount = localCart.reduce((sum, item) => sum + item.quantity, 0);
    return shopifyCount + firebaseCount;
  };

  // Get cart subtotal
  const getCartSubtotal = () => {
    const shopifyTotal = parseFloat(getCartTotal() || 0);
    const firebaseTotal = localCart.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );
    return (shopifyTotal + firebaseTotal).toFixed(2);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    // Check local cart for Firebase products
    const inLocalCart = localCart.some(item => item.id === productId);
    if (inLocalCart) return true;

    // For Shopify products, we need to check by variant ID
    // This is a simplified check - in reality, you'd need to check specific variant IDs
    return false;
  };

  // Checkout handler
  const handleCheckout = async () => {
    // If we have Shopify items, redirect to Shopify checkout
    if (getCartCount() > 0) {
      const checkoutUrl = getCheckoutUrl();
      if (checkoutUrl) {
        // If we also have Firebase items, we need to handle them separately
        if (localCart.length > 0) {
          // Store Firebase items for later processing
          localStorage.setItem('pending_firebase_order', JSON.stringify(localCart));
          
          // Clear local cart since we're checking out
          setLocalCart([]);
        }
        
        // Redirect to Shopify checkout
        window.location.href = checkoutUrl;
      }
    } else if (localCart.length > 0) {
      // Handle Firebase-only checkout
      // You can implement your custom checkout flow here
      alert('Custom checkout for Firebase products - implement your flow here');
    }
  };

  const value = {
    cart: getAllCartItems(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount: getTotalCartCount(),
    cartTotal: getCartSubtotal(),
    isInCart,
    isOpen,
    setIsOpen,
    handleCheckout,
    loading: cartLoading,
    checkout // Shopify checkout object
  };

  return (
    <ShopifyCartContext.Provider value={value}>
      {children}
    </ShopifyCartContext.Provider>
  );
};