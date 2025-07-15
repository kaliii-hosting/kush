import { usePageContent } from '../context/PageContentContext';

const About = () => {
  const { pageContent, loading } = usePageContent();
  const content = pageContent?.about || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-darker to-black">
      {/* Hero Section */}
      {content.hero && (
        <div className="relative min-h-[60vh] flex items-center justify-center">
          {/* Background Media */}
          {content.hero.videoUrl && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={content.hero.videoUrl} type="video/mp4" />
            </video>
          )}
          {content.hero.imageUrl && !content.hero.videoUrl && (
            <img 
              src={content.hero.imageUrl} 
              alt={content.hero.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-6xl font-black text-white mb-4">
              {content.hero.title || 'About Kushie'}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {content.hero.subtitle || 'Pioneering Excellence in Cannabis Since Day One'}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        {content.mission && (
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              {content.mission.title}
            </h2>
            <p className="text-xl text-spotify-text-subdued mb-6 max-w-3xl mx-auto">
              {content.mission.subtitle}
            </p>
            <p className="text-lg text-spotify-text-subdued max-w-4xl mx-auto">
              {content.mission.description}
            </p>
          </div>
        )}

        {/* Values Section */}
        {content.values && content.values.items && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              {content.values.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.values.items.map((value, index) => (
                <div key={index} className="bg-spotify-light-gray rounded-lg p-6 hover:bg-spotify-card-hover transition-colors">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-black">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-spotify-text-subdued">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional content sections can be added here */}
      </div>
    </div>
  );
};

export default About;