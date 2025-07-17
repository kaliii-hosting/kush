import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { realtimeDb as database } from '../../../config/firebase';
import { ref, set, get, child } from 'firebase/database';

// Simple test components
const SimpleText = ({ text = "Hello" }) => {
  return <p className="text-white">{text}</p>;
};

const SimpleContainer = ({ children }) => {
  return <div className="p-4 bg-gray-800 min-h-[200px]">{children}</div>;
};

SimpleText.craft = {
  displayName: 'Text',
};

SimpleContainer.craft = {
  displayName: 'Container',
};

const CraftEditorSimple = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-4">
        <h1 className="text-white text-2xl mb-4">Simple Craft.js Test</h1>
        
        <Editor resolver={{ SimpleText, SimpleContainer }}>
          <div className="bg-gray-800 p-4 rounded">
            <Frame>
              <Element is={SimpleContainer} canvas>
                <SimpleText text="This is a test" />
              </Element>
            </Frame>
          </div>
        </Editor>
      </div>
    </div>
  );
};

export default CraftEditorSimple;