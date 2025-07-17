import React from 'react';
import { useNode } from '@craftjs/core';

export const CTASection = ({ title, subtitle, buttonText, buttonLink, backgroundColor }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="py-16 px-6"
      style={{ backgroundColor: backgroundColor || '#CB6015' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title || 'Ready to Get Started?'}
        </h2>
        {subtitle && (
          <p className="text-lg text-white/90 mb-8">
            {subtitle}
          </p>
        )}
        <button
          className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-colors"
          onClick={() => {
            if (buttonLink) window.open(buttonLink, '_blank');
          }}
        >
          {buttonText || 'Get Started Now'}
        </button>
      </div>
    </div>
  );
};

const CTASectionSettings = () => {
  const { actions: { setProp }, title, subtitle, buttonText, buttonLink, backgroundColor } = useNode((node) => ({
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    buttonText: node.data.props.buttonText,
    buttonLink: node.data.props.buttonLink,
    backgroundColor: node.data.props.backgroundColor
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Title</label>
        <input
          type="text"
          value={title || 'Ready to Get Started?'}
          onChange={(e) => setProp((props) => props.title = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Subtitle</label>
        <input
          type="text"
          value={subtitle || ''}
          onChange={(e) => setProp((props) => props.subtitle = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Button Text</label>
        <input
          type="text"
          value={buttonText || 'Get Started Now'}
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
        <label className="block text-sm text-gray-lighter mb-2">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#CB6015'}
          onChange={(e) => setProp((props) => props.backgroundColor = e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

CTASection.craft = {
  displayName: 'CTA Section',
  props: {
    title: 'Ready to Get Started?',
    subtitle: '',
    buttonText: 'Get Started Now',
    buttonLink: '',
    backgroundColor: '#CB6015'
  },
  related: {
    settings: CTASectionSettings
  }
};