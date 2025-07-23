import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Youtube, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: 'Shop', href: '/shop' },
      { name: 'Wholesale', href: '/wholesale' },
      { name: 'About', href: '/about' },
    ],
    Resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Docs', href: '/docs' },
      { name: 'Contact', href: '/contact' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/kushie", label: "GitHub" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/kushie", label: "Twitter" },
    { icon: <MessageCircle className="w-5 h-5" />, href: "https://discord.gg/kushie", label: "Discord" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/company/kushie", label: "LinkedIn" },
    { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com/@kushie", label: "YouTube" }
  ];

  return (
    <footer className="bg-black border-t border-white/10 mb-16 md:mb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          {/* Logo section - centered on mobile */}
          <div className="text-center md:text-left mb-8 md:mb-0">
            <Link to="/" className="inline-flex items-center mb-4">
              <img 
                src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"
                alt="Kushie Logo"
                className="h-12 md:h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto md:mx-0 md:max-w-sm">
              Premium cannabis products delivered with quality and care.
            </p>
            {/* Social links - centered on mobile */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links - 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mt-8 md:mt-12">
            {/* Logo column on desktop only */}
            <div className="hidden md:block"></div>
            
            {/* Footer links - centered on mobile */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="text-center md:text-left">
                <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Kushie. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;