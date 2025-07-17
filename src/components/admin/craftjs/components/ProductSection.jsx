import React from 'react';
import { useNode } from '@craftjs/core';
import { useEnhancedProducts } from '../../../../context/EnhancedProductsContext';

export const ProductSection = ({ sectionType, title, subtitle, maxProducts }) => {
  const { connectors: { connect, drag } } = useNode();
  const { shopifyProducts } = useEnhancedProducts();
  
  const displayProducts = shopifyProducts.slice(0, maxProducts || 6);

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="py-8 px-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{title || 'Featured Products'}</h2>
          {subtitle && <p className="text-gray-lighter mt-1">{subtitle}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayProducts.map((product) => (
          <div key={product.id} className="bg-gray-dark rounded-lg p-4 hover:bg-gray-light transition-colors">
            <div className="aspect-square mb-4 overflow-hidden rounded-md">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-primary font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductSectionSettings = () => {
  const { actions: { setProp }, sectionType, title, subtitle, maxProducts } = useNode((node) => ({
    sectionType: node.data.props.sectionType,
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    maxProducts: node.data.props.maxProducts
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Section Type</label>
        <select
          value={sectionType || 'featured'}
          onChange={(e) => setProp((props) => props.sectionType = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="featured">Featured</option>
          <option value="trending">Trending</option>
          <option value="new">New Arrivals</option>
          <option value="popular">Popular</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Title</label>
        <input
          type="text"
          value={title || 'Featured Products'}
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
        <label className="block text-sm text-gray-lighter mb-2">Max Products</label>
        <input
          type="number"
          value={maxProducts || 6}
          onChange={(e) => setProp((props) => props.maxProducts = parseInt(e.target.value))}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
          min="1"
          max="12"
        />
      </div>
    </div>
  );
};

ProductSection.craft = {
  displayName: 'Product Section',
  props: {
    sectionType: 'featured',
    title: 'Featured Products',
    subtitle: '',
    maxProducts: 6
  },
  related: {
    settings: ProductSectionSettings
  }
};