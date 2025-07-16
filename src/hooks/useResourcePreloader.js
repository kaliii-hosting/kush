import { useEffect } from 'react';

const useResourcePreloader = () => {
  useEffect(() => {
    // Preload critical images
    const preloadImages = [
      // Add your critical hero images here
    ];

    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const domains = [
      'https://fchtwxunzmkzbnibqbwl.supabase.co',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Prefetch DNS for domains we'll use
    const dnsPrefetchDomains = [
      'https://fchtwxunzmkzbnibqbwl.supabase.co'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);
};

export default useResourcePreloader;