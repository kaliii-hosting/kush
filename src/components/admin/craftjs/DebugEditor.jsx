import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Container } from './components/Container';
import { Text } from './components/Text';
import { Hero } from './components/Hero';
import { ContentSection } from './components/ContentSection';
import { CTASection } from './components/CTASection';
import { ProductSection } from './components/ProductSection';
import { VideoSection } from './components/VideoSection';
import { Button } from './components/Button';
import { Image } from './components/Image';
import { pageTemplates } from './pageTemplates';

const DebugCanvas = ({ selectedPage }) => {
  const { actions, query } = useEditor();
  
  useEffect(() => {
    console.log('DebugCanvas: Loading template for', selectedPage);
    const template = pageTemplates[selectedPage];
    if (template) {
      console.log('DebugCanvas: Template found:', template);
      try {
        actions.deserialize(JSON.stringify(template));
        console.log('DebugCanvas: Template loaded successfully');
      } catch (error) {
        console.error('DebugCanvas: Error loading template:', error);
      }
    }
  }, [selectedPage, actions]);

  return (
    <Frame>
      <Element is={Container} canvas>
        <Text text="Debug mode - template should load above this" />
      </Element>
    </Frame>
  );
};

const DebugEditor = () => {
  const [selectedPage, setSelectedPage] = useState('homepage');

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="mb-4">
        <select 
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          <option value="homepage">Homepage</option>
          <option value="about">About</option>
          <option value="shop">Shop</option>
        </select>
      </div>
      
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
      >
        <div className="bg-black p-4 rounded">
          <DebugCanvas selectedPage={selectedPage} />
        </div>
      </Editor>
    </div>
  );
};

export default DebugEditor;