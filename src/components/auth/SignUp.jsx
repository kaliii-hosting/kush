import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, AlertCircle, Phone, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignUp = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const { signUp, signInWithGoogle, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [scale, setScale] = useState(1);

  // Calculate scale based on window size and zoom
  useEffect(() => {
    const calculateScale = () => {
      const baseWidth = 1920; // Base width for scale 1
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      const zoomLevel = window.devicePixelRatio;
      
      // Calculate scale based on viewport and zoom
      let widthScale = currentWidth / baseWidth;
      let heightScale = currentHeight / 900; // Base height
      let newScale = Math.min(widthScale, heightScale, 1);
      
      // Adjust for zoom level
      if (zoomLevel > 1) {
        newScale = newScale / (zoomLevel * 0.8);
      }
      
      // Special handling for mobile
      if (currentWidth < 768) {
        newScale = Math.min(currentWidth / 600, currentHeight / 800);
      }
      
      // Set minimum and maximum scale
      newScale = Math.max(0.3, Math.min(1.2, newScale));
      
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name, {
        phone: formData.phone,
        address: formData.address,
        licenseNumber: formData.licenseNumber
      });
      onClose();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" onClick={onClose} />
      
      {/* Modal Container with dynamic scaling */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div 
          className="signup-modal-container relative"
          style={{
            width: '1200px',
            height: '720px',
            maxWidth: '95vw',
            maxHeight: '95vh',
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <div className="relative bg-spotify-light-gray shadow-2xl w-full h-full overflow-hidden rounded-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-spotify-card-hover rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Left side - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary to-primary-dark p-8 flex-col justify-center">
              <div className="text-white">
                {/* Logo */}
                <div className="mb-4">
                  <img 
                    src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Kushie%20Kaliii%20Logo.svg"
                    alt="Kushie"
                    className="h-16 w-auto"
                  />
                </div>
                <p className="text-base opacity-90 mb-4">Create your account and discover premium cannabis products</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Premium Selection</h4>
                      <p className="text-xs opacity-80">Access our curated collection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Member Benefits</h4>
                      <p className="text-xs opacity-80">Exclusive deals and early access</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Fast Delivery</h4>
                      <p className="text-xs opacity-80">Quick and discreet shipping</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-3/5 p-4 lg:p-6 flex flex-col">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-3 text-center flex-shrink-0">
                <img 
                  src="https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Kushie%20Kaliii%20Logo.svg"
                  alt="Kushie"
                  className="h-10 w-auto mx-auto"
                />
              </div>

              <div className="w-full max-w-[600px] lg:max-w-full mx-auto flex-1 flex flex-col">
                {/* Error message */}
                {(formError || error) && (
                  <div className="mb-2 p-2 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2 flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-xs">{formError || error}</p>
                  </div>
                )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-white mb-0.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-spotify-gray text-white pl-8 pr-2 py-1.5 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="Enter name"
                        required
                      />
                      <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-spotify-text-subdued" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-white mb-0.5">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-spotify-gray text-white pl-8 pr-2 py-1.5 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="Enter email"
                        required
                      />
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-spotify-text-subdued" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-white mb-0.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-spotify-gray text-white pl-8 pr-2 py-1.5 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="Password"
                        required
                      />
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-spotify-text-subdued" />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-medium text-white mb-0.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-spotify-gray text-white pl-8 pr-2 py-1.5 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="Confirm"
                        required
                      />
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-spotify-text-subdued" />
                    </div>
                  </div>

                  {/* Phone Number (Optional) */}
                  <div>
                    <label className="block text-xs font-medium text-white mb-0.5">
                      Phone <span className="text-spotify-text-subdued text-[10px]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-spotify-gray text-white pl-8 pr-2 py-1.5 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="Phone number"
                      />
                      <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-spotify-text-subdued" />
                    </div>
                  </div>

                  {/* License Number (Optional) */}
                  <div>
                    <label className="block text-xs font-medium text-white mb-0.5">
                      License <span className="text-spotify-text-subdued text-[10px]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full bg-spotify-gray text-white pl-8 pr-2 py-1.5 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="License number"
                      />
                      <CreditCard className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-spotify-text-subdued" />
                    </div>
                  </div>
                </div>

                {/* Address (Optional) - Full width */}
                <div>
                  <label className="block text-xs font-medium text-white mb-0.5">
                    Address <span className="text-spotify-text-subdued text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-spotify-gray text-white pl-8 pr-2 py-1.5 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                      placeholder="Enter your address"
                    />
                    <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-spotify-text-subdued" />
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    className="rounded border-spotify-card-hover bg-spotify-gray mt-0.5"
                    required 
                  />
                  <label className="text-[11px] text-spotify-text-subdued">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-spotify-green hover:bg-spotify-green-hover text-black font-bold py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-spotify-card-hover"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-spotify-light-gray text-spotify-text-subdued">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold py-2 rounded-full transition-all disabled:opacity-50 text-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

              {/* Sign in link */}
              <p className="text-center mt-2 text-spotify-text-subdued text-xs">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToSignIn}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default SignUp;