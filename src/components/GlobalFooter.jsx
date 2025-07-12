import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

const GlobalFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    products: [
      { name: 'Shop All', href: '/shop' },
      { name: 'New Arrivals', href: '/shop?filter=new' },
      { name: 'Best Sellers', href: '/shop?filter=bestsellers' },
      { name: 'Wholesale', href: '/wholesale' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Lab Results', href: '/lab-results' },
      { name: 'Compliance', href: '/compliance' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="bg-black border-t border-spotify-light-gray">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg" 
                alt="Kushie Logo" 
                className="h-10 w-auto"
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

          {/* Links Sections */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-spotify-text-subdued hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-spotify-text-subdued hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-spotify-text-subdued hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-spotify-text-subdued hover:text-white transition-colors flex items-center gap-1"
                  >
                    {link.name}
                    {link.href.includes('lab-results') && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-spotify-light-gray" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-spotify-light-gray text-spotify-text-subdued hover:bg-spotify-card-hover hover:text-white transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright and Additional Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-spotify-text-subdued">
            <span>© {currentYear} Kushie. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
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