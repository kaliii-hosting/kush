import React, { useEffect } from 'react';
import { useEditor, Frame, Element } from '@craftjs/core';
import { Container } from './components/Container';

export const PageEditor = ({ pageData, onReady }) => {
  const { actions, query } = useEditor();

  useEffect(() => {
    // Add a small delay to ensure the editor is fully initialized
    const timer = setTimeout(() => {
      if (pageData && actions) {
        try {
          // Parse the data if it's a string
          const data = typeof pageData === 'string' ? JSON.parse(pageData) : pageData;
          console.log('PageEditor: Loading page data into editor:', data);
          console.log('PageEditor: Data keys:', Object.keys(data));
          
          // Clear current content and load new data
          actions.clearEvents();
          
          // Try to deserialize the data
          const serializedData = typeof data === 'string' ? data : JSON.stringify(data);
          console.log('PageEditor: Serialized data:', serializedData);
          
          actions.deserialize(serializedData);
          console.log('PageEditor: Deserialization completed');
          
          if (onReady) {
            onReady();
          }
        } catch (error) {
          console.error('PageEditor: Error loading page data:', error);
          console.error('PageEditor: Error details:', error.message);
          // If there's an error, just show an empty container
          actions.clearEvents();
          if (onReady) {
            onReady();
          }
        }
      } else {
        console.log('PageEditor: No page data or actions not ready', { pageData: !!pageData, actions: !!actions });
        if (onReady) {
          onReady();
        }
      }
    }, 100); // Small delay to ensure editor is ready

    return () => clearTimeout(timer);
  }, [pageData, actions, onReady]);

  // If we have page data, let the useEffect handle loading it
  if (pageData) {
    return <Frame />;
  }

  // Otherwise show the default empty state
  return (
    <Frame>
      <Element is={Container} canvas>
        {/* Empty container - user will drag components here */}
      </Element>
    </Frame>
  );
};