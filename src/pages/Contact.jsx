import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <h1 className="text-6xl font-black text-white mb-8">Get in Touch</h1>
          
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
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-300 mb-8">
                  We're here to help and answer any question you might have. We look forward to hearing from you.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-white">Email</h3>
                    <p className="text-gray-400">contact@kushie.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-white">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-white">Address</h3>
                    <p className="text-gray-400">
                      123 Cannabis Street<br />
                      Los Angeles, CA 90001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;