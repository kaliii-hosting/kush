import { Mail, Phone, MapPin } from 'lucide-react';
import { usePageContent } from '../context/PageContentContext';
import DynamicSection from '../components/DynamicSection';

const ContactDynamic = () => {
  const { pageContent } = usePageContent();
  const sections = pageContent?.contact?.sections || [];

  return (
    <div className="bg-black min-h-screen">
      {/* Render dynamic sections */}
      {sections.map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}

      {/* Contact Form - Static for now since it needs functionality */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded-md border-0 bg-gray-dark px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-md border-0 bg-gray-dark px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full rounded-md border-0 bg-gray-dark px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your message..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary-hover hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Additional info if not in sections */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Visit Our Store</h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-dark">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.2741099147!2d-118.69192047471659!3d34.02016130653294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1635001234567!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDynamic;