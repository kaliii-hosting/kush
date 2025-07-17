import React from 'react';
import { Frame, Element } from '@craftjs/core';
import { Container } from './components/Container';
import { Text } from './components/Text';
import { Hero } from './components/Hero';
import { ContentSection } from './components/ContentSection';
import { CTASection } from './components/CTASection';
import { ProductSection } from './components/ProductSection';

export const TemplateRenderer = ({ selectedPage }) => {
  // Render templates directly with Element components
  const renderHomepage = () => (
    <Frame>
      <Element is={Container} canvas id="homepage-container">
        <Element is={Hero} id="homepage-hero"
          title="Welcome to Our Store"
          subtitle="Discover premium products curated just for you"
          buttonText="Shop Now"
          buttonLink="/shop"
          alignment="center"
        />
        <Element is={ProductSection} id="homepage-products"
          sectionType="featured"
          title="Featured Products"
          subtitle="Check out our best sellers"
          maxProducts={6}
        />
        <Element is={ContentSection} id="homepage-content"
          layout="text-only"
          title="Why Choose Us"
          content="We provide the highest quality products with exceptional customer service."
          buttonText="Learn More"
          buttonLink="/about"
        />
        <Element is={CTASection} id="homepage-cta"
          title="Ready to Get Started?"
          subtitle="Join thousands of satisfied customers"
          buttonText="Sign Up Now"
          buttonLink="/account"
        />
      </Element>
    </Frame>
  );

  const renderAbout = () => (
    <Frame>
      <Element is={Container} canvas id="about-container">
        <Element is={Hero} id="about-hero"
          title="About Us"
          subtitle="Learn more about our story and mission"
          alignment="center"
        />
        <Element is={ContentSection} id="about-story"
          layout="image-right"
          title="Our Story"
          content="Founded with a passion for quality and excellence, we strive to bring you the best products."
          imageUrl="https://via.placeholder.com/600x400"
        />
        <Element is={ContentSection} id="about-mission"
          layout="image-left"
          title="Our Mission"
          content="To provide exceptional products that enhance your lifestyle while maintaining sustainable practices."
          imageUrl="https://via.placeholder.com/600x400"
        />
      </Element>
    </Frame>
  );

  const renderShop = () => (
    <Frame>
      <Element is={Container} canvas id="shop-container">
        <Element is={Hero} id="shop-hero"
          title="Shop All Products"
          subtitle="Browse our complete collection"
          alignment="center"
        />
        <Element is={ProductSection} id="shop-new"
          sectionType="new"
          title="New Arrivals"
          maxProducts={8}
        />
        <Element is={ProductSection} id="shop-popular"
          sectionType="popular"
          title="Popular Products"
          maxProducts={8}
        />
      </Element>
    </Frame>
  );

  const renderWholesale = () => (
    <Frame>
      <Element is={Container} canvas id="wholesale-container">
        <Element is={Hero} id="wholesale-hero"
          title="Wholesale Partners"
          subtitle="Join our wholesale program for exclusive benefits"
          buttonText="Apply Now"
          buttonLink="/wholesale"
          alignment="center"
        />
        <Element is={ContentSection} id="wholesale-content"
          layout="text-only"
          title="Benefits for Wholesale Partners"
          content="Enjoy exclusive pricing, priority support, and access to our full product catalog."
        />
        <Element is={CTASection} id="wholesale-cta"
          title="Ready to Partner?"
          subtitle="Get in touch to discuss wholesale opportunities"
          buttonText="Contact Us"
          buttonLink="/contact"
          backgroundColor="#CB6015"
        />
      </Element>
    </Frame>
  );

  const renderContact = () => (
    <Frame>
      <Element is={Container} canvas id="contact-container">
        <Element is={Hero} id="contact-hero"
          title="Contact Us"
          subtitle="We'd love to hear from you"
          alignment="center"
        />
        <Element is={ContentSection} id="contact-content"
          layout="text-only"
          title="Get in Touch"
          content="Have questions? Send us a message and we'll respond within 24 hours."
        />
      </Element>
    </Frame>
  );

  const renderBlog = () => (
    <Frame>
      <Element is={Container} canvas id="blog-container">
        <Element is={Hero} id="blog-hero"
          title="Our Blog"
          subtitle="Stay updated with the latest news and insights"
          alignment="center"
        />
        <Element is={ContentSection} id="blog-content"
          layout="text-only"
          title="Recent Posts"
          content="Check out our latest articles and updates."
        />
      </Element>
    </Frame>
  );

  // Default fallback
  const renderDefault = () => (
    <Frame>
      <Element is={Container} canvas id="default-container">
        <Text text={`Template for ${selectedPage} not found. Drag components to start building.`} />
      </Element>
    </Frame>
  );

  switch (selectedPage) {
    case 'homepage':
      return renderHomepage();
    case 'about':
      return renderAbout();
    case 'shop':
      return renderShop();
    case 'wholesale':
      return renderWholesale();
    case 'contact':
      return renderContact();
    case 'blog':
      return renderBlog();
    default:
      return renderDefault();
  }
};