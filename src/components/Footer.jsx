import { Github, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/huly", label: "GitHub" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/huly", label: "Twitter" },
    { icon: <MessageCircle className="w-5 h-5" />, href: "https://discord.gg/huly", label: "Discord" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/company/huly", label: "LinkedIn" },
    { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com/@huly", label: "YouTube" }
  ];

  return (
    <footer className="border-t border-huly-border bg-black">
      <div className="max-w-[1312px] mx-auto px-5 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left side - Logo and copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <a href="/" className="flex items-center">
              <img 
                src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"
                alt="Kushie Logo"
                className="h-8"
              />
            </a>
            <span className="text-huly-text-light text-[14px]">
              © {currentYear} Kushie. All rights reserved.
            </span>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-8">
            <a href="/privacy" className="text-huly-text-light hover:text-white text-[14px] transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-huly-text-light hover:text-white text-[14px] transition-colors">
              Terms of Service
            </a>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-huly-text-light hover:text-white transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;