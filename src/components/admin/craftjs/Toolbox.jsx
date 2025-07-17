import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Play, 
  ShoppingBag, 
  FileText, 
  MousePointer,
  Layers
} from 'lucide-react';
import { Text } from './components/Text';
import { Button } from './components/Button';
import { Image } from './components/Image';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { VideoSection } from './components/VideoSection';
import { ContentSection } from './components/ContentSection';
import { CTASection } from './components/CTASection';
import { Container } from './components/Container';

const ToolboxItem = ({ icon: Icon, label, component }) => {
  const { connectors } = useEditor();
  
  return (
    <div
      ref={(ref) => connectors.create(ref, component)}
      className="bg-gray-dark hover:bg-gray-light p-4 rounded-lg cursor-move transition-colors group"
    >
      <Icon className="h-8 w-8 text-gray-lighter group-hover:text-white mb-2 mx-auto" />
      <p className="text-xs text-gray-lighter text-center group-hover:text-white">{label}</p>
    </div>
  );
};

export const Toolbox = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">Components</h3>
      
      <div className="space-y-2">
        <p className="text-gray-lighter text-sm">Layout</p>
        <div className="grid grid-cols-2 gap-2">
          <ToolboxItem 
            icon={Layers} 
            label="Container" 
            component={<Element is={Container} canvas />}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-lighter text-sm">Basic</p>
        <div className="grid grid-cols-2 gap-2">
          <ToolboxItem 
            icon={Type} 
            label="Text" 
            component={<Text text="Edit me" />}
          />
          <ToolboxItem 
            icon={MousePointer} 
            label="Button" 
            component={<Button text="Click me" />}
          />
          <ToolboxItem 
            icon={ImageIcon} 
            label="Image" 
            component={<Image src="https://via.placeholder.com/300x200" />}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-lighter text-sm">Sections</p>
        <div className="grid grid-cols-2 gap-2">
          <ToolboxItem 
            icon={Square} 
            label="Hero" 
            component={<Hero />}
          />
          <ToolboxItem 
            icon={ShoppingBag} 
            label="Products" 
            component={<ProductSection />}
          />
          <ToolboxItem 
            icon={Play} 
            label="Video" 
            component={<VideoSection />}
          />
          <ToolboxItem 
            icon={FileText} 
            label="Content" 
            component={<ContentSection />}
          />
          <ToolboxItem 
            icon={MousePointer} 
            label="CTA" 
            component={<CTASection />}
          />
        </div>
      </div>
    </div>
  );
};