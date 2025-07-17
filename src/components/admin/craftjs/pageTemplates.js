// Default page templates for different pages
export const pageTemplates = {
  homepage: {
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: { background: '#000000', padding: '0px' },
      displayName: 'Container',
      custom: {},
      hidden: false,
      nodes: ['hero1', 'products1', 'content1', 'cta1'],
      linkedNodes: {}
    },
    hero1: {
      type: { resolvedName: 'Hero' },
      isCanvas: false,
      props: {
        title: 'Welcome to Our Store',
        subtitle: 'Discover premium products curated just for you',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        alignment: 'center'
      },
      displayName: 'Hero Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    products1: {
      type: { resolvedName: 'ProductSection' },
      isCanvas: false,
      props: {
        sectionType: 'featured',
        title: 'Featured Products',
        subtitle: 'Check out our best sellers',
        maxProducts: 6
      },
      displayName: 'Product Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    content1: {
      type: { resolvedName: 'ContentSection' },
      isCanvas: false,
      props: {
        layout: 'text-only',
        title: 'Why Choose Us',
        content: 'We provide the highest quality products with exceptional customer service.',
        buttonText: 'Learn More',
        buttonLink: '/about'
      },
      displayName: 'Content Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    cta1: {
      type: { resolvedName: 'CTASection' },
      isCanvas: false,
      props: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of satisfied customers',
        buttonText: 'Sign Up Now',
        buttonLink: '/account'
      },
      displayName: 'CTA Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    }
  },
  about: {
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: { background: '#000000', padding: '0px' },
      displayName: 'Container',
      custom: {},
      hidden: false,
      nodes: ['hero2', 'content2', 'content3'],
      linkedNodes: {}
    },
    hero2: {
      type: { resolvedName: 'Hero' },
      isCanvas: false,
      props: {
        title: 'About Us',
        subtitle: 'Learn more about our story and mission',
        alignment: 'center'
      },
      displayName: 'Hero Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    content2: {
      type: { resolvedName: 'ContentSection' },
      isCanvas: false,
      props: {
        layout: 'image-right',
        title: 'Our Story',
        content: 'Founded with a passion for quality and excellence, we strive to bring you the best products.',
        imageUrl: 'https://via.placeholder.com/600x400'
      },
      displayName: 'Content Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    content3: {
      type: { resolvedName: 'ContentSection' },
      isCanvas: false,
      props: {
        layout: 'image-left',
        title: 'Our Mission',
        content: 'To provide exceptional products that enhance your lifestyle while maintaining sustainable practices.',
        imageUrl: 'https://via.placeholder.com/600x400'
      },
      displayName: 'Content Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    }
  },
  shop: {
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: { background: '#000000', padding: '0px' },
      displayName: 'Container',
      custom: {},
      hidden: false,
      nodes: ['hero3', 'products2', 'products3'],
      linkedNodes: {}
    },
    hero3: {
      type: { resolvedName: 'Hero' },
      isCanvas: false,
      props: {
        title: 'Shop All Products',
        subtitle: 'Browse our complete collection',
        alignment: 'center'
      },
      displayName: 'Hero Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    products2: {
      type: { resolvedName: 'ProductSection' },
      isCanvas: false,
      props: {
        sectionType: 'new',
        title: 'New Arrivals',
        maxProducts: 8
      },
      displayName: 'Product Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    products3: {
      type: { resolvedName: 'ProductSection' },
      isCanvas: false,
      props: {
        sectionType: 'popular',
        title: 'Popular Products',
        maxProducts: 8
      },
      displayName: 'Product Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    }
  },
  wholesale: {
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: { background: '#000000', padding: '0px' },
      displayName: 'Container',
      custom: {},
      hidden: false,
      nodes: ['hero4', 'content4', 'cta2'],
      linkedNodes: {}
    },
    hero4: {
      type: { resolvedName: 'Hero' },
      isCanvas: false,
      props: {
        title: 'Wholesale Partners',
        subtitle: 'Join our wholesale program for exclusive benefits',
        buttonText: 'Apply Now',
        buttonLink: '/wholesale',
        alignment: 'center'
      },
      displayName: 'Hero Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    content4: {
      type: { resolvedName: 'ContentSection' },
      isCanvas: false,
      props: {
        layout: 'text-only',
        title: 'Benefits for Wholesale Partners',
        content: 'Enjoy exclusive pricing, priority support, and access to our full product catalog.'
      },
      displayName: 'Content Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    cta2: {
      type: { resolvedName: 'CTASection' },
      isCanvas: false,
      props: {
        title: 'Ready to Partner?',
        subtitle: 'Get in touch to discuss wholesale opportunities',
        buttonText: 'Contact Us',
        buttonLink: '/contact',
        backgroundColor: '#CB6015'
      },
      displayName: 'CTA Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    }
  },
  contact: {
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: { background: '#000000', padding: '0px' },
      displayName: 'Container',
      custom: {},
      hidden: false,
      nodes: ['hero5', 'content5'],
      linkedNodes: {}
    },
    hero5: {
      type: { resolvedName: 'Hero' },
      isCanvas: false,
      props: {
        title: 'Contact Us',
        subtitle: 'We\'d love to hear from you',
        alignment: 'center'
      },
      displayName: 'Hero Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    content5: {
      type: { resolvedName: 'ContentSection' },
      isCanvas: false,
      props: {
        layout: 'text-only',
        title: 'Get in Touch',
        content: 'Have questions? Send us a message and we\'ll respond within 24 hours.'
      },
      displayName: 'Content Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    }
  },
  blog: {
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: { background: '#000000', padding: '0px' },
      displayName: 'Container',
      custom: {},
      hidden: false,
      nodes: ['hero6', 'content6'],
      linkedNodes: {}
    },
    hero6: {
      type: { resolvedName: 'Hero' },
      isCanvas: false,
      props: {
        title: 'Our Blog',
        subtitle: 'Stay updated with the latest news and insights',
        alignment: 'center'
      },
      displayName: 'Hero Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    content6: {
      type: { resolvedName: 'ContentSection' },
      isCanvas: false,
      props: {
        layout: 'text-only',
        title: 'Recent Posts',
        content: 'Check out our latest articles and updates.'
      },
      displayName: 'Content Section',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {}
    }
  }
};