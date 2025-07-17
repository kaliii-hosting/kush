import React from 'react';
import { useNode } from '@craftjs/core';

export const Image = ({ src, alt, width, height, objectFit }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <img
      ref={(ref) => connect(drag(ref))}
      src={src || 'https://via.placeholder.com/300x200'}
      alt={alt || 'Image'}
      style={{
        width: width || '100%',
        height: height || 'auto',
        objectFit: objectFit || 'cover'
      }}
      className="rounded-lg"
    />
  );
};

const ImageSettings = () => {
  const { actions: { setProp }, src, alt, width, height, objectFit } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
    objectFit: node.data.props.objectFit
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Image URL</label>
        <input
          type="text"
          value={src || ''}
          onChange={(e) => setProp((props) => props.src = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Alt Text</label>
        <input
          type="text"
          value={alt || ''}
          onChange={(e) => setProp((props) => props.alt = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Width</label>
        <input
          type="text"
          value={width || '100%'}
          onChange={(e) => setProp((props) => props.width = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Height</label>
        <input
          type="text"
          value={height || 'auto'}
          onChange={(e) => setProp((props) => props.height = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Object Fit</label>
        <select
          value={objectFit || 'cover'}
          onChange={(e) => setProp((props) => props.objectFit = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </div>
    </div>
  );
};

Image.craft = {
  displayName: 'Image',
  props: {
    src: 'https://via.placeholder.com/300x200',
    alt: 'Image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover'
  },
  related: {
    settings: ImageSettings
  }
};