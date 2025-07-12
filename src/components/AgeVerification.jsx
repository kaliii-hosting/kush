import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgeVerification = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleOver21 = () => {
    // Age verified successfully
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
      <div className="fixed inset-0 bg-black/90 z-[100]" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="relative bg-spotify-light-gray rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

          {/* Content */}
          <div className="relative p-6">
            {/* Logo */}
            <div className="text-center mb-4">
              <img 
                src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"
                alt="Kushie Logo"
                className="w-32 h-32 mx-auto"
                loading="eager"
              />
            </div>
            
            {/* Header Text */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Age Verification Required
              </h1>
              
              <p className="text-spotify-text-subdued text-sm">
                You must be 21 years or older to enter this site
              </p>
            </div>

            {/* Age Selection */}
            <div className="mb-6">
              <p className="text-white font-medium text-center mb-4 text-sm">
                Please confirm your age:
              </p>
              
              <div className="space-y-3">
                {/* Over 21 Button */}
                <button
                  onClick={handleOver21}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-full transition-all hover:scale-[1.02]"
                >
                  I am 21 or older
                </button>
                
                {/* Under 21 Button */}
                <button
                  onClick={handleUnder21}
                  className="w-full bg-transparent border-2 border-spotify-card-hover hover:border-white text-white font-semibold py-3 rounded-full transition-all"
                >
                  I am under 21
                </button>
              </div>
            </div>

            {/* Legal Notice */}
            <p className="text-xs text-spotify-text-subdued text-center mb-6">
              By entering this site, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>

            {/* Bottom Warning */}
            <div className="pt-5 border-t border-spotify-card-hover">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-spotify-text-subdued">
                  <p className="font-semibold text-yellow-500 mb-0.5">WARNING</p>
                  <p className="leading-relaxed">Cannabis products are for use only by adults 21 years of age or older. Keep out of reach of children and pets.</p>
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