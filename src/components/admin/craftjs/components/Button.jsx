import React from 'react';
import { useNode } from '@craftjs/core';

export const Button = ({ text, link, variant, size }) => {
  const { connectors: { connect, drag } } = useNode();
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black',
    ghost: 'bg-transparent text-white hover:bg-white/10'
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={(ref) => connect(drag(ref))}
      className={`${variants[variant || 'primary']} ${sizes[size || 'medium']} rounded-full font-medium transition-all`}
      onClick={(e) => {
        e.preventDefault();
        if (link) window.open(link, '_blank');
      }}
    >
      {text}
    </button>
  );
};

const ButtonSettings = () => {
  const { actions: { setProp }, text, link, variant, size } = useNode((node) => ({
    text: node.data.props.text,
    link: node.data.props.link,
    variant: node.data.props.variant,
    size: node.data.props.size
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Button Text</label>
        <input
          type="text"
          value={text || 'Click me'}
          onChange={(e) => setProp((props) => props.text = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Link URL</label>
        <input
          type="text"
          value={link || ''}
          onChange={(e) => setProp((props) => props.link = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
          placeholder="https://example.com"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Variant</label>
        <select
          value={variant || 'primary'}
          onChange={(e) => setProp((props) => props.variant = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Size</label>
        <select
          value={size || 'medium'}
          onChange={(e) => setProp((props) => props.size = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    text: 'Click me',
    link: '',
    variant: 'primary',
    size: 'medium'
  },
  related: {
    settings: ButtonSettings
  }
};