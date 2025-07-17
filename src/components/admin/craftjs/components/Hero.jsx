import React from 'react';
import { useNode } from '@craftjs/core';

export const Hero = ({ title, subtitle, buttonText, buttonLink, backgroundImage, alignment }) => {
  const { connectors: { connect, drag } } = useNode();
  
  const alignments = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="relative min-h-[500px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundImage ? 'transparent' : '#000000'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      
      <div className={`relative z-10 max-w-4xl mx-auto flex flex-col gap-6 px-6 ${alignments[alignment || 'center']}`}>
        <h1 className="text-5xl font-bold text-white">
          {title || 'Welcome to Our Site'}
        </h1>
        <p className="text-xl text-gray-300">
          {subtitle || 'Discover amazing products and services'}
        </p>
        {buttonText && (
          <div className={`mt-4 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}`}>
            <a 
              href={buttonLink || '#'} 
              className="inline-block bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              {buttonText || 'Get Started'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const HeroSettings = () => {
  const { actions: { setProp }, title, subtitle, buttonText, buttonLink, backgroundImage, alignment } = useNode((node) => ({
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    buttonText: node.data.props.buttonText,
    buttonLink: node.data.props.buttonLink,
    backgroundImage: node.data.props.backgroundImage,
    alignment: node.data.props.alignment
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Title</label>
        <input
          type="text"
          value={title || 'Welcome to Our Site'}
          onChange={(e) => setProp((props) => props.title = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Subtitle</label>
        <input
          type="text"
          value={subtitle || 'Discover amazing products and services'}
          onChange={(e) => setProp((props) => props.subtitle = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Button Text</label>
        <input
          type="text"
          value={buttonText || 'Get Started'}
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
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Background Image URL</label>
        <input
          type="text"
          value={backgroundImage || ''}
          onChange={(e) => setProp((props) => props.backgroundImage = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Alignment</label>
        <select
          value={alignment || 'center'}
          onChange={(e) => setProp((props) => props.alignment = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
};

Hero.craft = {
  displayName: 'Hero Section',
  props: {
    title: 'Welcome to Our Site',
    subtitle: 'Discover amazing products and services',
    buttonText: 'Get Started',
    buttonLink: '',
    backgroundImage: '',
    alignment: 'center'
  },
  related: {
    settings: HeroSettings
  }
};