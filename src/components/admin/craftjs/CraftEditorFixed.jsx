import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import { realtimeDb as database } from '../../../config/firebase';
import { ref, set, get, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { SettingsPanel } from './SettingsPanel';
import { TopBar } from './TopBar';
import './craft.css';
import { RealPageRenderer } from './RealPageRenderer';

// Import all craftable components
import { Container } from './components/Container';
import { Text } from './components/Text';
import { Button } from './components/Button';
import { Image } from './components/Image';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { VideoSection } from './components/VideoSection';
import { ContentSection } from './components/ContentSection';
import { CTASection } from './components/CTASection';
import { EditablePageSection } from './components/EditablePageSection';

// Import page components used in RealPageRenderer
import SpotifyHomeDynamic from '../../SpotifyHomeDynamic';
import ShopDynamic from '../../../pages/ShopDynamic';
import WholesaleDynamic from '../../../pages/WholesaleDynamic';
import About from '../../../pages/About';
import Contact from '../../../pages/Contact';
import Blog from '../../../pages/Blog';

const CraftEditorFixed = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [pages] = useState([
    { id: 'homepage', name: 'Homepage', path: '/' },
    { id: 'about', name: 'About Us', path: '/about' },
    { id: 'shop', name: 'Shop', path: '/shop' },
    { id: 'wholesale', name: 'Wholesale', path: '/wholesale' },
    { id: 'contact', name: 'Contact', path: '/contact' },
    { id: 'blog', name: 'Blog', path: '/blog' }
  ]);

  useEffect(() => {
    // Load existing page data from Firebase
    const loadPageData = async () => {
      setLoading(true);
      try {
        console.log('Loading page data for:', selectedPage);
        const dbRef = ref(database);
        
        // Map website builder page names to actual Firebase paths
        const pageMap = {
          'homepage': 'home',
          'about': 'about', 
          'shop': 'shop',
          'wholesale': 'wholesale',
          'contact': 'contact',
          'blog': 'blog'
        };
        
        const firebasePage = pageMap[selectedPage] || selectedPage;
        const snapshot = await get(child(dbRef, `pageContent/${firebasePage}`));
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Found existing data for', firebasePage, ':', data);
          setPageData(data);
        } else {
          console.log('No data found for', firebasePage);
          setPageData(null);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadPageData();
  }, [selectedPage]);

  const savePageData = async (data) => {
    try {
      await set(ref(database, `pageContent/${selectedPage}/craftjs`), data);
      alert(`${pages.find(p => p.id === selectedPage)?.name || 'Page'} saved successfully!`);
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page. Please try again.');
    }
  };

  const handlePageChange = (pageId) => {
    if (pageId !== selectedPage) {
      const confirmChange = window.confirm('Any unsaved changes will be lost. Continue?');
      if (confirmChange) {
        setIsEditorReady(false);
        setLoading(true);
        setPageData(null); // Clear current page data
        setSelectedPage(pageId);
      }
    }
  };

  const handleEditorReady = () => {
    setIsEditorReady(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading editor...</div>
      </div>
    );
  }

  return (
    <Editor
      resolver={{
        Container,
        Text,
        Button,
        Image,
        Hero,
        ProductSection,
        VideoSection,
        ContentSection,
        CTASection,
        EditablePageSection,
        SpotifyHomeDynamic,
        ShopDynamic,
        WholesaleDynamic,
        About,
        Contact,
        Blog
      }}
    >
      <div className="min-h-screen bg-gray-900">
        <TopBar 
          onSave={savePageData} 
          selectedPage={selectedPage}
          pages={pages}
          onPageChange={handlePageChange}
        />
        
        <div className="flex h-[calc(100vh-64px)]">
          {/* Main Canvas - Full Width */}
          <div className="flex-1 bg-gray-900 overflow-y-auto">
            <div className="w-full bg-black min-h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading {pages.find(p => p.id === selectedPage)?.name}...</p>
                  </div>
                </div>
              ) : (
                <RealPageRenderer 
                  selectedPage={selectedPage} 
                  pageData={pageData}
                />
              )}
            </div>
          </div>
          
          {/* Right Settings Panel */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <SettingsPanel />
          </div>
        </div>
        
        {/* Layers Panel */}
        <div className="fixed bottom-4 left-4 w-64 bg-gray-800 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="text-white font-semibold mb-2">Layers</h3>
          <Layers />
        </div>
      </div>
    </Editor>
  );
};

export default CraftEditorFixed;