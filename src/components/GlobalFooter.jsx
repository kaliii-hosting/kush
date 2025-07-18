import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { usePageContent } from '../context/PageContentContext';
import { useLogos } from '../context/LogosContext';

const GlobalFooter = () => {
  const currentYear = new Date().getFullYear();
  const { pageContent } = usePageContent();
  const { logos } = useLogos();
  
  // Get footer content from PageContentContext
  const footerSection = pageContent?.home?.sections?.find(s => s.type === 'footer');
  
  // Use footer data if available, otherwise use defaults
  const newsletter = footerSection?.newsletter || {
    title: 'Stay Updated',
    description: 'Get the latest news and exclusive offers',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe'
  };
  
  const columns = footerSection?.columns || [
    {
      id: 'company',
      title: 'Company',
      links: [
        { text: 'About Us', url: '/about' },
        { text: 'Careers', url: '/careers' },
        { text: 'Press', url: '/press' },
        { text: 'Blog', url: '/blog' },
      ]
    },
    {
      id: 'products',
      title: 'Products',
      links: [
        { text: 'Shop All', url: '/shop' },
        { text: 'New Arrivals', url: '/shop?filter=new' },
        { text: 'Best Sellers', url: '/shop?filter=bestsellers' },
        { text: 'Wholesale', url: '/wholesale' },
      ]
    },
    {
      id: 'support',
      title: 'Support',
      links: [
        { text: 'Contact Us', url: '/contact' },
        { text: 'FAQs', url: '/faqs' },
        { text: 'Shipping Info', url: '/shipping' },
        { text: 'Returns', url: '/returns' },
      ]
    },
    {
      id: 'legal',
      title: 'Legal',
      links: [
        { text: 'Privacy Policy', url: '/privacy' },
        { text: 'Terms of Service', url: '/terms' },
        { text: 'Lab Results', url: '/lab-results' },
        { text: 'Compliance', url: '/compliance' },
      ]
    }
  ];
  
  const socialLinks = footerSection?.socialLinks || [
    { platform: 'facebook', url: 'https://facebook.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'youtube', url: 'https://youtube.com' },
  ];
  
  const copyright = footerSection?.copyright || `© ${currentYear} Kushie. All rights reserved.`;
  
  const bottomLinks = footerSection?.bottomLinks || [
    { text: 'Sitemap', url: '/sitemap' },
    { text: 'Accessibility', url: '/accessibility' },
  ];

  // Social icon mapping
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
  };

  return (
    <footer className="footer-section bg-black border-t border-spotify-light-gray">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        
        {/* Newsletter Section */}
        {newsletter && (
          <div className="mb-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{newsletter.title}</h3>
            <p className="text-spotify-text-subdued mb-6">{newsletter.description}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={newsletter.placeholder}
                className="flex-1 bg-spotify-light-gray text-white px-6 py-3 rounded-full placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                {newsletter.buttonText}
              </button>
            </form>
          </div>
        )}
        
        {/* Divider */}
        <div className="mb-12 border-t border-spotify-light-gray" />
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Logo and Company Info */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={logos?.footer?.url || "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"} 
                alt={logos?.footer?.alt || "Kushie Logo"} 
                style={{
                  width: logos?.footer?.width === 'auto' ? 'auto' : `${logos?.footer?.width}px`,
                  height: logos?.footer?.height === 'auto' ? 'auto' : `${logos?.footer?.height}px`,
                  maxHeight: '40px'
                }}
              />
            </Link>
            <p className="text-sm text-spotify-text-subdued mb-6 max-w-sm">
              Premium cannabis products delivered with care. Quality, consistency, and customer satisfaction are our priorities.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-spotify-text-subdued">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Multiple locations across 6 states</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-spotify-text-subdued">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:1-800-KUSHIE" className="hover:text-white transition-colors">
                  1-800-KUSHIE
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-spotify-text-subdued">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:support@kushie.com" className="hover:text-white transition-colors">
                  support@kushie.com
                </a>
              </div>
            </div>
          </div>

          {/* Dynamic Columns */}
          {columns.map((column) => (
            <div key={column.id}>
              <h3 className="text-sm font-semibold text-white mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links?.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.url} 
                      className="text-sm text-spotify-text-subdued hover:text-white transition-colors flex items-center gap-1"
                    >
                      {link.text}
                      {link.url.includes('lab-results') && (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-spotify-light-gray" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = socialIcons[social.platform] || socialIcons.facebook;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-spotify-light-gray text-spotify-text-subdued hover:bg-spotify-card-hover hover:text-white transition-all"
                  aria-label={social.platform}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright and Additional Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-spotify-text-subdued">
            <span>{copyright}</span>
            <div className="flex items-center gap-6">
              {bottomLinks?.map((link, index) => (
                <Link key={index} to={link.url} className="hover:text-white transition-colors">
                  {link.text}
                </Link>
              ))}
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>

        {/* Age Verification Notice */}
        <div className="mt-8 rounded-lg bg-spotify-light-gray/50 p-4 text-center">
          <p className="text-xs text-spotify-text-subdued">
            <span className="font-semibold">WARNING:</span> Products may contain THC. Keep out of reach of children and pets. 
            For use only by adults 21 years of age and older. Do not drive or operate machinery.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;