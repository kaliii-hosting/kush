import React from 'react';
import { Frame, Element } from '@craftjs/core';
import { Container } from './components/Container';

export const EditorCanvas = ({ pageData }) => {
  // If we have saved data, just render the Frame with that data
  if (pageData) {
    return <Frame data={pageData} />;
  }
  
  // Otherwise render the default empty state with a simple container
  return (
    <Frame>
      <Element is={Container} canvas>
        {/* Empty container - user will drag components here */}
      </Element>
    </Frame>
  );
};