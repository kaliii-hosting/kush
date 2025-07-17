import React from 'react';
import { useNode } from '@craftjs/core';

export const EditablePageSectionSettings = () => {
  const { actions: { setProp }, sectionData } = useNode((node) => ({
    sectionData: node.data.props.sectionData
  }));

  if (!sectionData) return <div className="text-white p-4">No section data found</div>;

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-white font-semibold text-lg">{sectionData.name}</h3>
      
      {sectionData.type === 'hero' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input 
              type="text" 
              value={sectionData.title || ''} 
              onChange={(e) => setProp(props => {
                props.sectionData.title = e.target.value;
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
            <input 
              type="text" 
              value={sectionData.subtitle || ''} 
              onChange={(e) => setProp(props => {
                props.sectionData.subtitle = e.target.value;
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {sectionData.buttonText && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Button Text</label>
              <input 
                type="text" 
                value={sectionData.buttonText || ''} 
                onChange={(e) => setProp(props => {
                  props.sectionData.buttonText = e.target.value;
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          {sectionData.buttonLink && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Button Link</label>
              <input 
                type="text" 
                value={sectionData.buttonLink || ''} 
                onChange={(e) => setProp(props => {
                  props.sectionData.buttonLink = e.target.value;
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          {sectionData.alignment && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Alignment</label>
              <select 
                value={sectionData.alignment || 'center'} 
                onChange={(e) => setProp(props => {
                  props.sectionData.alignment = e.target.value;
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}
        </div>
      )}
      
      {sectionData.type === 'products' && (
        <div className="text-gray-300">
          <p>This section automatically displays products from your Shopify store.</p>
          <p className="text-sm text-gray-400 mt-2">Product type: {sectionData.productType}</p>
          <div className="mt-4 p-3 bg-gray-700 rounded">
            <p className="text-sm">Product sections are dynamic and managed by your product data. You can rearrange this section but the content is automatically generated.</p>
          </div>
        </div>
      )}
      
      {sectionData.type === 'content' && sectionData.content && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <textarea 
            value={sectionData.content || ''} 
            onChange={(e) => setProp(props => {
              props.sectionData.content = e.target.value;
            })}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-600">
        <p className="text-xs text-gray-400">
          Section ID: {sectionData.id}
        </p>
        <p className="text-xs text-gray-400">
          Type: {sectionData.type}
        </p>
      </div>
    </div>
  );
};

export default EditablePageSectionSettings;