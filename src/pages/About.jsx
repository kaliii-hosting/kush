const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-darker to-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <h1 className="text-6xl font-black text-white mb-8">About Kushie</h1>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xl text-spotify-text-subdued mb-6">
                Welcome to Kushie. We're not just another cannabis company—we're your trusted partner in premium quality and exceptional service.
              </p>
              <p className="text-lg text-spotify-text-subdued mb-6">
                Founded with a passion for excellence, we carefully curate our selection to bring you only the finest cannabis products. From farm to your door, every step is handled with care.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-black">✓</span>
                  </div>
                  <span className="text-white font-bold">Premium Quality Products</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-black">✓</span>
                  </div>
                  <span className="text-white font-bold">Fast & Discreet Delivery</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-black">✓</span>
                  </div>
                  <span className="text-white font-bold">Expert Customer Support</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-text-secondary">
                To provide safe, reliable access to premium cannabis products while educating and empowering our community. We believe in transparency, quality, and putting our customers first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;