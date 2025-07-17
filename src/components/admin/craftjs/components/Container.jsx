import React from 'react';
import { useNode } from '@craftjs/core';

export const Container = ({ children, background, padding, className }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`min-h-[100px] ${className || ''}`}
      style={{
        backgroundColor: background || 'transparent',
        padding: padding || '20px'
      }}
    >
      {children || (
        <div className="text-gray-500 text-center py-8">
          Drag components here to start building
        </div>
      )}
    </div>
  );
};

const ContainerSettings = () => {
  const { actions: { setProp }, background, padding } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Background Color</label>
        <input
          type="color"
          value={background || '#000000'}
          onChange={(e) => setProp((props) => props.background = e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Padding</label>
        <input
          type="text"
          value={padding || '20px'}
          onChange={(e) => setProp((props) => props.padding = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    background: '#000000',
    padding: '20px'
  },
  related: {
    settings: ContainerSettings
  }
};