import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { realtimeDb } from '../config/firebase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from Firebase
  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    const wishlistRef = ref(realtimeDb, `wishlists/${user.uid}`);
    
    const unsubscribe = onValue(wishlistRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array of product IDs
        const items = Object.keys(data).filter(key => data[key] === true);
        setWishlistItems(items);
      } else {
        setWishlistItems([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!user) {
      // You could show a login prompt here
      console.log('User must be logged in to add to wishlist');
      return false;
    }

    try {
      const wishlistRef = ref(realtimeDb, `wishlists/${user.uid}/${productId}`);
      await set(wishlistRef, true);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!user) return false;

    try {
      const wishlistRef = ref(realtimeDb, `wishlists/${user.uid}/${productId}`);
      await set(wishlistRef, null);
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  // Toggle wishlist item
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (!user) return false;

    try {
      const wishlistRef = ref(realtimeDb, `wishlists/${user.uid}`);
      await set(wishlistRef, null);
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};