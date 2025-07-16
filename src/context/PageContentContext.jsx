import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { realtimeDb } from '../config/firebase';

const PageContentContext = createContext();

export const usePageContent = () => {
  const context = useContext(PageContentContext);
  if (!context) {
    throw new Error('usePageContent must be used within a PageContentProvider');
  }
  return context;
};

// Default content structure for all pages
const defaultPageContent = {
  home: {
    hero: {
      videoUrl: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/videos/background%20real.mp4',
      title: 'Good Afternoon',
      subtitle: 'What would you like to order today?',
      buttonText: '',
      buttonLink: ''
    },
    goldCartridges: {
      videoUrl: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/videos/Gold%20Cartridges%20Video.mp4',
      title: 'Gold Standard Cartridges',
      subtitle: 'Experience luxury with our gold series',
      buttonText: 'Discover Gold Series',
      buttonLink: '/shop'
    },
    disposables: {
      videoUrl: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/videos/Dspsbls%20NeoGreen%20Video.mp4',
      title: 'Disposables Redefined',
      subtitle: 'Premium disposable vapes with cutting-edge technology',
      buttonText: 'Shop Disposables',
      buttonLink: '/shop?category=disposables'
    },
    premiumExperience: {
      videoUrl: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/videos/background%20video%201.mp4',
      title: 'Experience Premium Quality',
      subtitle: 'Discover our exclusive collection of artisanal cannabis products',
      buttonText: 'Explore Collection',
      buttonLink: '/shop'
    },
    innovation: {
      videoUrl: 'https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/videos/background%20video%202.mp4',
      title: 'The Future of Cannabis is Here',
      subtitle: 'Cutting-edge extraction methods and innovative delivery systems',
      buttonText: 'Shop New Arrivals',
      buttonLink: '/shop?filter=new'
    }
  },
  about: {
    hero: {
      imageUrl: '',
      videoUrl: '',
      title: 'Our Story',
      subtitle: 'Pioneering Excellence in Cannabis Since Day One',
      buttonText: '',
      buttonLink: ''
    },
    mission: {
      title: 'Our Mission',
      subtitle: 'Elevating Cannabis Culture',
      description: 'We believe in providing premium cannabis products that enhance your lifestyle while maintaining the highest standards of quality and safety.'
    },
    values: {
      title: 'Our Values',
      items: [
        { title: 'Quality First', description: 'Every product meets our rigorous standards' },
        { title: 'Innovation', description: 'Constantly pushing boundaries in cannabis technology' },
        { title: 'Sustainability', description: 'Committed to environmental responsibility' },
        { title: 'Community', description: 'Building connections through shared experiences' }
      ]
    }
  },
  shop: {
    hero: {
      title: 'Premium Cannabis Collection',
      subtitle: 'Discover our carefully curated selection',
      backgroundImage: ''
    },
    categories: {
      title: 'Shop by Category',
      subtitle: 'Find exactly what you\'re looking for'
    }
  },
  wholesale: {
    hero: {
      videoUrl: '',
      imageUrl: '',
      title: 'Partner With Kushie',
      subtitle: 'Join the fastest growing cannabis brand in the industry',
      buttonText: 'Apply Now',
      buttonLink: '#apply'
    },
    benefits: {
      title: 'Why Partner With Us',
      subtitle: 'Benefits that set us apart',
      items: [
        { title: 'Premium Products', description: 'Access to our full line of award-winning products' },
        { title: 'Marketing Support', description: 'Professional materials and campaigns' },
        { title: 'Fast Shipping', description: 'Same-day processing on most orders' },
        { title: 'Dedicated Support', description: 'Personal account manager for your business' }
      ]
    }
  },
  contact: {
    hero: {
      title: 'Get in Touch',
      subtitle: 'We\'re here to help with any questions',
      backgroundImage: ''
    },
    info: {
      title: 'Contact Information',
      email: 'support@kushie.com',
      phone: '1-800-KUSHIE',
      hours: 'Monday - Friday: 9AM - 6PM PST'
    }
  }
};

export const PageContentProvider = ({ children }) => {
  const [pageContent, setPageContent] = useState(defaultPageContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load content from Firebase
  useEffect(() => {
    const contentRef = ref(realtimeDb, 'pageContent');
    
    const unsubscribe = onValue(contentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPageContent(data);
      } else {
        // If no content exists, populate with defaults
        set(contentRef, defaultPageContent);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update specific page content
  const updatePageContent = async (pageName, section, content) => {
    setSaving(true);
    try {
      const updates = {
        ...pageContent,
        [pageName]: {
          ...pageContent[pageName],
          [section]: content
        }
      };
      
      await set(ref(realtimeDb, 'pageContent'), updates);
      setPageContent(updates);
      return true;
    } catch (error) {
      console.error('Error updating page content:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Update entire page
  const updateEntirePage = async (pageName, content) => {
    setSaving(true);
    try {
      const updates = {
        ...pageContent,
        [pageName]: content
      };
      
      await set(ref(realtimeDb, 'pageContent'), updates);
      setPageContent(updates);
      return true;
    } catch (error) {
      console.error('Error updating page:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    setSaving(true);
    try {
      await set(ref(realtimeDb, 'pageContent'), defaultPageContent);
      setPageContent(defaultPageContent);
      return true;
    } catch (error) {
      console.error('Error resetting content:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const value = {
    pageContent,
    loading,
    saving,
    updatePageContent,
    updateEntirePage,
    resetToDefaults,
    defaultPageContent
  };

  return (
    <PageContentContext.Provider value={value}>
      {children}
    </PageContentContext.Provider>
  );
};

export default PageContentContext;