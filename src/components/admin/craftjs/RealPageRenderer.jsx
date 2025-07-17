import React from 'react';
import { Frame, Element } from '@craftjs/core';
import { Container } from './components/Container';
import { Text } from './components/Text';
import { EditablePageSection } from './components/EditablePageSection';
import SpotifyHomeDynamic from '../../SpotifyHomeDynamic';
import ShopDynamic from '../../../pages/ShopDynamic';
import WholesaleDynamic from '../../../pages/WholesaleDynamic';
import About from '../../../pages/About';
import Contact from '../../../pages/Contact';
import Blog from '../../../pages/Blog';

export const RealPageRenderer = ({ selectedPage, pageData }) => {
  console.log('RealPageRenderer - Page:', selectedPage, 'Data:', pageData);

  // Render homepage with editable sections
  const renderHomepageWithSections = () => {
    if (!pageData || !pageData.sections) {
      return (
        <Frame>
          <Element is={Container} canvas id="homepage-container">
            <div className="w-full bg-black text-white p-8">
              <h2 className="text-xl mb-4">Loading Homepage Content...</h2>
              <p className="text-gray-300">
                Checking Firebase for page content at: pageContent/home
              </p>
            </div>
          </Element>
        </Frame>
      );
    }

    return (
      <Frame>
        <Element is={Container} canvas id="homepage-container">
          <div className="w-full bg-black">
            {pageData.sections.map((section, index) => (
              <Element 
                key={`${section.id}-${index}`}
                is={EditablePageSection} 
                id={`homepage-section-${section.id || index}`}
                sectionData={section}
              />
            ))}
          </div>
        </Element>
      </Frame>
    );
  };

  // Render other pages with their actual components
  const renderOtherPages = () => {
    let PageComponent;
    
    switch (selectedPage) {
      case 'shop':
        PageComponent = ShopDynamic;
        break;
      case 'wholesale':
        PageComponent = WholesaleDynamic;
        break;
      case 'about':
        PageComponent = About;
        break;
      case 'contact':
        PageComponent = Contact;
        break;
      case 'blog':
        PageComponent = Blog;
        break;
      default:
        return (
          <Frame>
            <Element is={Container} canvas id={`${selectedPage}-container`}>
              <div className="text-center py-12">
                <div className="text-white">
                  <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
                  <p className="text-gray-300">
                    No page component found for: {selectedPage}
                  </p>
                </div>
              </div>
            </Element>
          </Frame>
        );
    }

    return (
      <Frame>
        <Element is={Container} canvas id={`${selectedPage}-container`}>
          <div className="w-full">
            <PageComponent />
          </div>
        </Element>
      </Frame>
    );
  };

  // Choose rendering method based on page
  if (selectedPage === 'homepage') {
    return renderHomepageWithSections();
  }

  return renderOtherPages();
};