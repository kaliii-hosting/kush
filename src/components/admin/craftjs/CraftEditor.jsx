import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import { realtimeDb as database } from '../../../config/firebase';
import { ref, set, get, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { Toolbox } from './Toolbox';
import { SettingsPanel } from './SettingsPanel';
import { TopBar } from './TopBar';
import './craft.css';
import { pageTemplates } from './pageTemplates';

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

const CraftEditor = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [selectedPage, setSelectedPage] = useState('homepage');
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
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `pageContent/${selectedPage}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert Firebase data to Craft.js format if needed
          setPageData(data.craftjs || null);
        } else {
          // No data exists, use template if available
          const template = pageTemplates[selectedPage];
          setPageData(template ? JSON.stringify(template) : null);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
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
        setSelectedPage(pageId);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-darkest">
        <div className="text-white">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-darkest">
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
          CTASection
        }}
        enabled={enabled}
      >
        <TopBar 
          onSave={savePageData} 
          selectedPage={selectedPage}
          pages={pages}
          onPageChange={handlePageChange}
        />
        
        <div className="flex">
          {/* Left Toolbox */}
          <div className="w-64 bg-gray-darker border-r border-gray-dark p-4">
            <Toolbox />
          </div>
          
          {/* Main Canvas */}
          <div className="flex-1 bg-gray-darkest p-8">
            <div className="max-w-6xl mx-auto bg-black rounded-lg shadow-2xl overflow-hidden">
              <Frame data={pageData}>
                {pageData ? null : (
                  <Element is={Container} canvas>
                    <Text text="Start building your page by dragging components from the left panel" />
                  </Element>
                )}
              </Frame>
            </div>
          </div>
          
          {/* Right Settings Panel */}
          <div className="w-80 bg-gray-darker border-l border-gray-dark">
            <SettingsPanel />
          </div>
        </div>
        
        {/* Layers Panel */}
        <div className="fixed bottom-4 left-4 w-64 bg-gray-darker rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="text-white font-semibold mb-2">Layers</h3>
          <Layers />
        </div>
      </Editor>
    </div>
  );
};

export default CraftEditor;