import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import { Shield, Lock, Save, Eye, EyeOff, AlertCircle } from 'lucide-react';

const PasswordsManagement = () => {
  const [passwords, setPasswords] = useState({
    adminPin: '',
    wholesalePin: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPins, setShowPins] = useState({
    admin: false,
    wholesale: false
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = () => {
    try {
      const passwordsRef = ref(realtimeDb, 'settings/passwords');
      
      const unsubscribe = onValue(passwordsRef, 
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setPasswords({
              adminPin: data.adminPin || '1973',
              wholesalePin: data.wholesalePin || '1973'
            });
          } else {
            // Set default passwords
            setPasswords({
              adminPin: '1973',
              wholesalePin: '1973'
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching passwords:', error);
          // Load defaults on error
          setPasswords({
            adminPin: '1973',
            wholesalePin: '1973'
          });
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      setLoading(false);
    }
  };

  const validatePin = (pin, field) => {
    const errors = {};
    
    if (!pin || pin.length < 4) {
      errors[field] = 'PIN must be at least 4 digits';
    } else if (!/^\d+$/.test(pin)) {
      errors[field] = 'PIN must contain only numbers';
    } else if (pin.length > 8) {
      errors[field] = 'PIN must be 8 digits or less';
    }
    
    return errors;
  };

  const handlePinChange = (field, value) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    
    setPasswords(prev => ({
      ...prev,
      [field]: numericValue
    }));
    
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [field.replace('Pin', '')]: ''
    }));
  };

  const handleSave = async () => {
    // Validate both PINs
    const adminErrors = validatePin(passwords.adminPin, 'admin');
    const wholesaleErrors = validatePin(passwords.wholesalePin, 'wholesale');
    const allErrors = { ...adminErrors, ...wholesaleErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    
    setSaving(true);
    setErrors({});
    
    try {
      const passwordsRef = ref(realtimeDb, 'settings/passwords');
      await update(passwordsRef, {
        adminPin: passwords.adminPin,
        wholesalePin: passwords.wholesalePin,
        updatedAt: new Date().toISOString()
      });
      
      setSuccessMessage('Passwords updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving passwords:', error);
      setErrors({ general: 'Failed to save passwords. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-spotify-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Password Management</h1>
        <p className="text-gray-400">Manage PIN codes for secure access to admin and wholesale areas</p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-500" />
          <p className="text-green-500">{successMessage}</p>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-500">{errors.general}</p>
        </div>
      )}

      <div className="grid gap-6 max-w-2xl">
        {/* Admin PIN */}
        <div className="bg-spotify-light-gray rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-spotify-green" />
            <h2 className="text-xl font-semibold text-white">Admin Dashboard PIN</h2>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            This PIN is required to access the admin dashboard
          </p>
          
          <div className="relative">
            <input
              type={showPins.admin ? 'text' : 'password'}
              value={passwords.adminPin}
              onChange={(e) => handlePinChange('adminPin', e.target.value)}
              maxLength="8"
              placeholder="Enter 4-8 digit PIN"
              className={`w-full px-4 py-3 bg-spotify-gray border rounded-lg text-white focus:outline-none focus:border-spotify-green ${
                errors.admin ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPins(prev => ({ ...prev, admin: !prev.admin }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPins.admin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.admin && (
            <p className="text-red-500 text-sm mt-2">{errors.admin}</p>
          )}
        </div>

        {/* Wholesale PIN */}
        <div className="bg-spotify-light-gray rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-spotify-green" />
            <h2 className="text-xl font-semibold text-white">Wholesale Page PIN</h2>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            This PIN is required to access the wholesale ordering page
          </p>
          
          <div className="relative">
            <input
              type={showPins.wholesale ? 'text' : 'password'}
              value={passwords.wholesalePin}
              onChange={(e) => handlePinChange('wholesalePin', e.target.value)}
              maxLength="8"
              placeholder="Enter 4-8 digit PIN"
              className={`w-full px-4 py-3 bg-spotify-gray border rounded-lg text-white focus:outline-none focus:border-spotify-green ${
                errors.wholesale ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPins(prev => ({ ...prev, wholesale: !prev.wholesale }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPins.wholesale ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.wholesale && (
            <p className="text-red-500 text-sm mt-2">{errors.wholesale}</p>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-spotify-green hover:bg-spotify-green-hover text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-yellow-500 font-semibold">Security Notice</p>
              <p className="text-gray-400 text-sm mt-1">
                Make sure to store these PINs securely and share them only with authorized personnel. 
                Changing these PINs will immediately affect access to the respective areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordsManagement;