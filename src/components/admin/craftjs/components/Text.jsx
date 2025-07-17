import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';

export const Text = ({ text, fontSize, color, fontWeight, textAlign }) => {
  const { connectors: { connect, drag }, selected, actions: { setProp } } = useNode((state) => ({
    selected: state.events.selected
  }));
  
  const [editable, setEditable] = useState(false);
  const [localText, setLocalText] = useState(text);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  useEffect(() => {
    if (!selected) {
      setEditable(false);
    }
  }, [selected]);

  return (
    <ContentEditable
      innerRef={(ref) => connect(drag(ref))}
      html={localText}
      disabled={!editable}
      onChange={(e) => {
        setLocalText(e.target.value);
        setProp((props) => props.text = e.target.value);
      }}
      onDoubleClick={() => selected && setEditable(true)}
      onBlur={() => setEditable(false)}
      style={{
        fontSize: fontSize || '16px',
        color: color || '#ffffff',
        fontWeight: fontWeight || 'normal',
        textAlign: textAlign || 'left',
        cursor: editable ? 'text' : 'move',
        outline: 'none'
      }}
      className={`${!editable ? 'select-none' : ''}`}
    />
  );
};

const TextSettings = () => {
  const { actions: { setProp }, fontSize, color, fontWeight, textAlign } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
    fontWeight: node.data.props.fontWeight,
    textAlign: node.data.props.textAlign
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Font Size</label>
        <select
          value={fontSize || '16px'}
          onChange={(e) => setProp((props) => props.fontSize = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="14px">Small</option>
          <option value="16px">Normal</option>
          <option value="20px">Large</option>
          <option value="24px">X-Large</option>
          <option value="32px">XX-Large</option>
          <option value="48px">Huge</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Color</label>
        <input
          type="color"
          value={color || '#ffffff'}
          onChange={(e) => setProp((props) => props.color = e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Font Weight</label>
        <select
          value={fontWeight || 'normal'}
          onChange={(e) => setProp((props) => props.fontWeight = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Text Align</label>
        <select
          value={textAlign || 'left'}
          onChange={(e) => setProp((props) => props.textAlign = e.target.value)}
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

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Edit me',
    fontSize: '16px',
    color: '#ffffff',
    fontWeight: 'normal',
    textAlign: 'left'
  },
  related: {
    settings: TextSettings
  }
};