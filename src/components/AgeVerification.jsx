import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogos } from '../context/LogosContext';

const AgeVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logos } = useLogos();
  
  // Check if current path is admin, wholesale, or sales
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isWholesaleRoute = location.pathname.startsWith('/wholesale');
  const isSalesRoute = location.pathname.startsWith('/sales');
  
  // Don't show age verification for admin, wholesale, and sales routes
  const shouldShowVerification = !isAdminRoute && !isWholesaleRoute && !isSalesRoute;
  
  // Always show age verification on every visit (except for admin/wholesale)
  const [isVisible, setIsVisible] = useState(shouldShowVerification);
  const [scale, setScale] = useState(1);
  
  // Calculate scale based on window size and zoom
  useEffect(() => {
    const calculateScale = () => {
      const baseWidth = 1920; // Base width for scale 1
      const currentWidth = window.innerWidth;
      const zoomLevel = window.devicePixelRatio;
      
      // Calculate scale based on viewport and zoom
      let newScale = Math.min(currentWidth / baseWidth, 1);
      
      // Adjust for zoom level
      if (zoomLevel > 1) {
        newScale = newScale / (zoomLevel * 0.8);
      }
      
      // Set minimum and maximum scale
      newScale = Math.max(0.5, Math.min(1.2, newScale));
      
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    // Listen for zoom changes
    const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
    const media = matchMedia(mqString);
    media.addEventListener('change', calculateScale);
    
    return () => {
      window.removeEventListener('resize', calculateScale);
      media.removeEventListener('change', calculateScale);
    };
  }, []);
  
  // Update visibility when route changes
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isWholesaleRoute = location.pathname.startsWith('/wholesale');
    const isSalesRoute = location.pathname.startsWith('/sales');
    const shouldShowVerification = !isAdminRoute && !isWholesaleRoute && !isSalesRoute;
    
    if (shouldShowVerification && !isVisible) {
      setIsVisible(true);
    } else if (!shouldShowVerification && isVisible) {
      setIsVisible(false);
    }
  }, [location.pathname]);

  const handleOver21 = () => {
    // Age verified successfully - hide the popup (no storage)
    setIsVisible(false);
  };

  const handleUnder21 = () => {
    // Redirect to underage page
    navigate('/underage');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black z-[100]" />
      
      {/* Modal Container with dynamic scaling */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="age-verification-modal-container relative"
          style={{
            width: '450px',
            height: 'auto',
            maxWidth: '95vw',
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <div className="relative bg-[#1a1a1a] rounded-2xl shadow-2xl w-full overflow-hidden">

          {/* Content */}
          <div className="relative p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <img 
                src={logos?.ageVerification?.url || "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"} 
                alt={logos?.ageVerification?.alt || "Kushie"} 
                className="mx-auto h-16 w-auto"
              />
            </div>
            
            {/* Header Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">
                Age Verification Required
              </h2>
              
              <p className="text-gray-400 text-base">
                You must be 21 years or older to enter this site
              </p>
            </div>

            {/* Age Selection */}
            <div className="mb-8">
              <p className="text-white font-normal text-center mb-6 text-base">
                Please confirm your age:
              </p>
              
              <div className="space-y-4">
                {/* Over 21 Button */}
                <button
                  onClick={handleOver21}
                  className="w-full bg-[#D2691E] hover:bg-[#B8601B] text-white font-semibold py-4 rounded-full transition-all text-lg"
                >
                  I am 21 or older
                </button>
                
                {/* Under 21 Button */}
                <button
                  onClick={handleUnder21}
                  className="w-full bg-[#2a2a2a] hover:bg-[#333333] text-white font-semibold py-4 rounded-full transition-all text-lg"
                >
                  I am under 21
                </button>
              </div>
            </div>

            {/* Legal Notice */}
            <p className="text-sm text-gray-400 text-center mb-8">
              By entering this site, you agree to our{' '}
              <a href="/terms" className="text-[#D2691E] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-[#D2691E] hover:underline">Privacy Policy</a>
            </p>

            {/* Bottom Warning */}
            <div className="pt-6 border-t border-[#333333]">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-500 mb-1">WARNING</p>
                  <p className="text-gray-400 leading-relaxed">Cannabis products are for use only by adults 21 years of age or older. Keep out of reach of children and pets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

    </>
  );
};

export default AgeVerification;