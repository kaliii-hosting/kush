import React from 'react';
import { useNode } from '@craftjs/core';

export const ContentSection = ({ layout, title, content, buttonText, buttonLink, imageUrl }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="py-12 px-6 bg-black"
    >
      <div className="max-w-6xl mx-auto">
        {layout === 'text-only' && (
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">{title || 'Content Title'}</h2>
            <p className="text-gray-300 text-lg mb-8">
              {content || 'Your content goes here. Add engaging text to capture your audience.'}
            </p>
            {buttonText && (
              <a 
                href={buttonLink || '#'} 
                className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                {buttonText}
              </a>
            )}
          </div>
        )}
        
        {layout === 'image-left' && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src={imageUrl || 'https://via.placeholder.com/600x400'} 
                alt="Content" 
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">{title || 'Content Title'}</h2>
              <p className="text-gray-300 text-lg mb-8">
                {content || 'Your content goes here. Add engaging text to capture your audience.'}
              </p>
              {buttonText && (
                <a 
                  href={buttonLink || '#'} 
                  className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        )}
        
        {layout === 'image-right' && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">{title || 'Content Title'}</h2>
              <p className="text-gray-300 text-lg mb-8">
                {content || 'Your content goes here. Add engaging text to capture your audience.'}
              </p>
              {buttonText && (
                <a 
                  href={buttonLink || '#'} 
                  className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  {buttonText}
                </a>
              )}
            </div>
            <div>
              <img 
                src={imageUrl || 'https://via.placeholder.com/600x400'} 
                alt="Content" 
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentSectionSettings = () => {
  const { actions: { setProp }, layout, title, content, buttonText, buttonLink, imageUrl } = useNode((node) => ({
    layout: node.data.props.layout,
    title: node.data.props.title,
    content: node.data.props.content,
    buttonText: node.data.props.buttonText,
    buttonLink: node.data.props.buttonLink,
    imageUrl: node.data.props.imageUrl
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Layout</label>
        <select
          value={layout || 'text-only'}
          onChange={(e) => setProp((props) => props.layout = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="text-only">Text Only</option>
          <option value="image-left">Image Left</option>
          <option value="image-right">Image Right</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Title</label>
        <input
          type="text"
          value={title || 'Content Title'}
          onChange={(e) => setProp((props) => props.title = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Content</label>
        <textarea
          value={content || 'Your content goes here. Add engaging text to capture your audience.'}
          onChange={(e) => setProp((props) => props.content = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
          rows="4"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Button Text</label>
        <input
          type="text"
          value={buttonText || ''}
          onChange={(e) => setProp((props) => props.buttonText = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Button Link</label>
        <input
          type="text"
          value={buttonLink || ''}
          onChange={(e) => setProp((props) => props.buttonLink = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      {(layout === 'image-left' || layout === 'image-right') && (
        <div>
          <label className="block text-sm text-gray-lighter mb-2">Image URL</label>
          <input
            type="text"
            value={imageUrl || ''}
            onChange={(e) => setProp((props) => props.imageUrl = e.target.value)}
            className="w-full px-3 py-2 bg-gray-dark text-white rounded"
          />
        </div>
      )}
    </div>
  );
};

ContentSection.craft = {
  displayName: 'Content Section',
  props: {
    layout: 'text-only',
    title: 'Content Title',
    content: 'Your content goes here. Add engaging text to capture your audience.',
    buttonText: '',
    buttonLink: '',
    imageUrl: 'https://via.placeholder.com/600x400'
  },
  related: {
    settings: ContentSectionSettings
  }
};