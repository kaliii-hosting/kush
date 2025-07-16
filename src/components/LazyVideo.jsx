import React, { useRef, useEffect, useState } from 'react';

const LazyVideo = ({ 
  src, 
  className = '', 
  poster = null,
  threshold = 0.1,
  rootMargin = '50px',
  ...videoProps 
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin, isInView]);

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.load();
    }
  }, [isInView]);

  const handleLoadedData = () => {
    setIsLoaded(true);
    if (videoRef.current && videoProps.autoPlay) {
      videoRef.current.play().catch(() => {
        console.log('Autoplay prevented by browser');
      });
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!isLoaded && poster && (
        <img 
          src={poster} 
          alt="Video placeholder" 
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {!isLoaded && !poster && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      {isInView && (
        <video
          ref={videoRef}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoadedData={handleLoadedData}
          preload="none"
          {...videoProps}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default LazyVideo;