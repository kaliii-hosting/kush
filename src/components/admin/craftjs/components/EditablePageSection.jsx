import React from 'react';
import { useNode, Element } from '@craftjs/core';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Text } from './Text';
import { Container } from './Container';
import ProductSections from '../../../ProductSections';
import AwardWinning from '../../../AwardWinning';
import EditablePageSectionSettings from './EditablePageSectionSettings';

export const EditablePageSection = ({ sectionData, ...props }) => {
  const { connectors: { connect, drag } } = useNode();

  if (!sectionData) return null;

  // Render editable hero section
  const renderEditableHero = () => {
    const isMainHero = sectionData.id === 'hero';
    const sectionIndex = ['goldCartridges', 'disposables', 'premiumExperience', 'innovation'].indexOf(sectionData.id);
    const isAlternateLayout = sectionIndex >= 0 && sectionIndex % 2 === 1;
    
    if (isMainHero) {
      return (
        <div className="relative h-[85vh] -mt-16 overflow-hidden">
          {/* Background Media */}
          {sectionData.videoUrl && (
            <video
              src={sectionData.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover scale-105"
            >
              <source src={sectionData.videoUrl} type="video/mp4" />
            </video>
          )}
          
          {sectionData.imageUrl && !sectionData.videoUrl && (
            <img
              src={sectionData.imageUrl}
              alt={sectionData.title || ''}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          {/* Editable Content */}
          <div className={`relative h-full flex items-center ${
            sectionData.alignment === 'left' ? 'justify-start' : 
            sectionData.alignment === 'right' ? 'justify-end' : 
            'justify-center'
          } ${
            sectionData.alignment === 'center' ? 'text-center' : 
            sectionData.alignment === 'right' ? 'text-right' : 
            'text-left'
          } px-8`}>
            <Element is={Container} canvas id={`hero-content-${sectionData.id}`}>
              <div className="max-w-4xl">
                {sectionData.title && (
                  <Element 
                    is={Text} 
                    id={`hero-title-${sectionData.id}`}
                    text={sectionData.title}
                    fontSize="4rem"
                    color="#ffffff"
                    fontWeight="700"
                    textAlign={sectionData.alignment || 'center'}
                  />
                )}
                {sectionData.subtitle && (
                  <Element 
                    is={Text} 
                    id={`hero-subtitle-${sectionData.id}`}
                    text={sectionData.subtitle}
                    fontSize="1.5rem"
                    color="#d1d5db"
                    fontWeight="normal"
                    textAlign={sectionData.alignment || 'center'}
                  />
                )}
              </div>
            </Element>
          </div>
        </div>
      );
    } else {
      // Video sections
      return (
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {sectionData.videoUrl && (
            <video
              src={sectionData.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={sectionData.videoUrl} type="video/mp4" />
            </video>
          )}
          
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative h-full">
            <div className="max-w-7xl mx-auto h-full px-6 lg:px-8">
              <div className={`h-full flex items-center ${
                sectionData.alignment ? (
                  sectionData.alignment === 'left' ? 'justify-start' : 
                  sectionData.alignment === 'right' ? 'justify-end' : 
                  'justify-center'
                ) : (isAlternateLayout ? 'justify-end' : 'justify-start')
              }`}>
                <Element is={Container} canvas id={`video-content-${sectionData.id}`}>
                  <div className={`max-w-xl ${
                    sectionData.alignment ? (
                      sectionData.alignment === 'center' ? 'text-center' : 
                      sectionData.alignment === 'right' ? 'text-right' : 
                      'text-left'
                    ) : (isAlternateLayout ? 'text-right' : 'text-left')
                  }`}>
                    {sectionData.title && (
                      <Element 
                        is={Text} 
                        id={`video-title-${sectionData.id}`}
                        text={sectionData.title}
                        fontSize="3rem"
                        color="#ffffff"
                        fontWeight="700"
                        textAlign={sectionData.alignment || (isAlternateLayout ? 'right' : 'left')}
                      />
                    )}
                    {sectionData.subtitle && (
                      <Element 
                        is={Text} 
                        id={`video-subtitle-${sectionData.id}`}
                        text={sectionData.subtitle}
                        fontSize="1.25rem"
                        color="#e5e7eb"
                        fontWeight="normal"
                        textAlign={sectionData.alignment || (isAlternateLayout ? 'right' : 'left')}
                      />
                    )}
                  </div>
                </Element>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  // Render editable content section
  const renderEditableContent = () => (
    <div className="px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Element is={Container} canvas id={`content-${sectionData.id}`}>
          {sectionData.title && (
            <Element 
              is={Text} 
              id={`content-title-${sectionData.id}`}
              text={sectionData.title}
              fontSize="2.5rem"
              color="#ffffff"
              fontWeight="700"
              textAlign="left"
            />
          )}
          {sectionData.subtitle && (
            <Element 
              is={Text} 
              id={`content-subtitle-${sectionData.id}`}
              text={sectionData.subtitle}
              fontSize="1.25rem"
              color="#9ca3af"
              fontWeight="normal"
              textAlign="left"
            />
          )}
          {sectionData.description && (
            <Element 
              is={Text} 
              id={`content-description-${sectionData.id}`}
              text={sectionData.description}
              fontSize="1.125rem"
              color="#d1d5db"
              fontWeight="normal"
              textAlign="left"
            />
          )}
        </Element>
      </div>
    </div>
  );

  // Render editable CTA section
  const renderEditableCTA = () => (
    <div className="px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-12">
        <Element is={Container} canvas id={`cta-${sectionData.id}`}>
          {sectionData.title && (
            <Element 
              is={Text} 
              id={`cta-title-${sectionData.id}`}
              text={sectionData.title}
              fontSize="2.5rem"
              color="#ffffff"
              fontWeight="700"
              textAlign="center"
            />
          )}
          {sectionData.description && (
            <Element 
              is={Text} 
              id={`cta-description-${sectionData.id}`}
              text={sectionData.description}
              fontSize="1.25rem"
              color="#d1d5db"
              fontWeight="normal"
              textAlign="center"
            />
          )}
        </Element>
      </div>
    </div>
  );

  return (
    <div
      ref={ref => connect(drag(ref))}
      className="relative group"
      style={{ minHeight: '50px' }}
    >
      {/* Edit overlay that appears on hover */}
      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none border-2 border-transparent group-hover:border-blue-500">
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {sectionData?.name || sectionData?.type || 'Section'}
        </div>
      </div>
      
      {/* Render appropriate editable section type */}
      {sectionData.type === 'hero' && renderEditableHero()}
      {sectionData.type === 'content' && renderEditableContent()}
      {sectionData.type === 'cta' && renderEditableCTA()}
      {sectionData.type === 'products' && <ProductSections productType={sectionData.productType} />}
      {sectionData.type === 'awardWinning' && <AwardWinning />}
    </div>
  );
};

EditablePageSection.craft = {
  displayName: 'Page Section',
  props: {
    sectionData: {}
  },
  related: {
    settings: EditablePageSectionSettings
  }
};