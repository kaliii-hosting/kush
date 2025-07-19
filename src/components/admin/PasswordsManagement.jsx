import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import { Lock, Eye, EyeOff, Check, X, Shield, Key } from 'lucide-react';

const PasswordsManagement = () => {
  const [adminPin, setAdminPin] = useState('');
  const [wholesalePin, setWholesalePin] = useState('');
  const [currentAdminPin, setCurrentAdminPin] = useState('');
  const [currentWholesalePin, setCurrentWholesalePin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [newWholesalePin, setNewWholesalePin] = useState('');
  const [confirmWholesalePin, setConfirmWholesalePin] = useState('');
  
  const [showCurrentAdminPin, setShowCurrentAdminPin] = useState(false);
  const [showNewAdminPin, setShowNewAdminPin] = useState(false);
  const [showConfirmAdminPin, setShowConfirmAdminPin] = useState(false);
  const [showCurrentWholesalePin, setShowCurrentWholesalePin] = useState(false);
  const [showNewWholesalePin, setShowNewWholesalePin] = useState(false);
  const [showConfirmWholesalePin, setShowConfirmWholesalePin] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminError, setAdminError] = useState('');
  const [wholesaleSuccess, setWholesaleSuccess] = useState('');
  const [wholesaleError, setWholesaleError] = useState('');

  // Load current PINs from Firebase on component mount
  useEffect(() => {
    const loadCurrentPins = async () => {
      try {
        // Load admin PIN
        const adminPinRef = ref(realtimeDb, 'settings/adminPin');
        const adminPinSnapshot = await get(adminPinRef);
        if (adminPinSnapshot.exists()) {
          setAdminPin(adminPinSnapshot.val());
        } else {
          // Set default admin PIN if not exists
          setAdminPin('1973');
          await set(adminPinRef, '1973');
        }

        // Load wholesale PIN
        const wholesalePinRef = ref(realtimeDb, 'settings/wholesalePin');
        const wholesalePinSnapshot = await get(wholesalePinRef);
        if (wholesalePinSnapshot.exists()) {
          setWholesalePin(wholesalePinSnapshot.val());
        } else {
          // Set default wholesale PIN if not exists
          setWholesalePin('0000');
          await set(wholesalePinRef, '0000');
        }
      } catch (error) {
        console.error('Error loading PINs:', error);
      }
    };

    loadCurrentPins();
  }, []);

  // Reset form and messages
  const resetAdminForm = () => {
    setCurrentAdminPin('');
    setNewAdminPin('');
    setConfirmAdminPin('');
    setAdminError('');
    setAdminSuccess('');
  };

  const resetWholesaleForm = () => {
    setCurrentWholesalePin('');
    setNewWholesalePin('');
    setConfirmWholesalePin('');
    setWholesaleError('');
    setWholesaleSuccess('');
  };

  // Validate PIN format (4 digits)
  const validatePin = (pin) => {
    return /^\d{4}$/.test(pin);
  };

  // Handle admin PIN change
  const handleAdminPinChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAdminError('');
    setAdminSuccess('');

    try {
      // Validate current PIN
      if (currentAdminPin !== adminPin) {
        setAdminError('Current PIN is incorrect');
        setLoading(false);
        return;
      }

      // Validate new PIN format
      if (!validatePin(newAdminPin)) {
        setAdminError('New PIN must be exactly 4 digits');
        setLoading(false);
        return;
      }

      // Validate PIN confirmation
      if (newAdminPin !== confirmAdminPin) {
        setAdminError('New PIN and confirmation do not match');
        setLoading(false);
        return;
      }

      // Save new admin PIN to Firebase
      const adminPinRef = ref(realtimeDb, 'settings/adminPin');
      await set(adminPinRef, newAdminPin);
      
      // Update local state
      setAdminPin(newAdminPin);
      setAdminSuccess('Admin PIN updated successfully!');
      resetAdminForm();

      // Hide success message after 3 seconds
      setTimeout(() => setAdminSuccess(''), 3000);

    } catch (error) {
      console.error('Error updating admin PIN:', error);
      setAdminError('Failed to update admin PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle wholesale PIN change
  const handleWholesalePinChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setWholesaleError('');
    setWholesaleSuccess('');

    try {
      // Validate current PIN
      if (currentWholesalePin !== wholesalePin) {
        setWholesaleError('Current PIN is incorrect');
        setLoading(false);
        return;
      }

      // Validate new PIN format
      if (!validatePin(newWholesalePin)) {
        setWholesaleError('New PIN must be exactly 4 digits');
        setLoading(false);
        return;
      }

      // Validate PIN confirmation
      if (newWholesalePin !== confirmWholesalePin) {
        setWholesaleError('New PIN and confirmation do not match');
        setLoading(false);
        return;
      }

      // Save new wholesale PIN to Firebase
      const wholesalePinRef = ref(realtimeDb, 'settings/wholesalePin');
      await set(wholesalePinRef, newWholesalePin);
      
      // Update local state
      setWholesalePin(newWholesalePin);
      setWholesaleSuccess('Wholesale PIN updated successfully!');
      resetWholesaleForm();

      // Hide success message after 3 seconds
      setTimeout(() => setWholesaleSuccess(''), 3000);

    } catch (error) {
      console.error('Error updating wholesale PIN:', error);
      setWholesaleError('Failed to update wholesale PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Password Management</h1>
          <p className="text-[#b3b3b3]">Manage PIN passwords for admin and wholesale access</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin PIN Section */}
          <div className="bg-[#181818] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#CB6015]/20 rounded-lg">
                <Shield className="w-6 h-6 text-[#CB6015]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin PIN</h2>
                <p className="text-sm text-[#b3b3b3]">Change the PIN for admin dashboard access</p>
              </div>
            </div>

            {/* Success/Error Messages */}
            {adminSuccess && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-500/20 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">{adminSuccess}</span>
              </div>
            )}
            
            {adminError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center gap-2">
                <X className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminPinChange} className="space-y-4">
              {/* Current Admin PIN */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Current Admin PIN
                </label>
                <div className="relative">
                  <input
                    type={showCurrentAdminPin ? 'text' : 'password'}
                    value={currentAdminPin}
                    onChange={(e) => setCurrentAdminPin(e.target.value)}
                    className="w-full bg-[#282828] border border-[#404040] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#CB6015]"
                    placeholder="Enter current PIN"
                    maxLength="4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentAdminPin(!showCurrentAdminPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    {showCurrentAdminPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Admin PIN */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  New Admin PIN
                </label>
                <div className="relative">
                  <input
                    type={showNewAdminPin ? 'text' : 'password'}
                    value={newAdminPin}
                    onChange={(e) => setNewAdminPin(e.target.value)}
                    className="w-full bg-[#282828] border border-[#404040] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#CB6015]"
                    placeholder="Enter new 4-digit PIN"
                    maxLength="4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewAdminPin(!showNewAdminPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    {showNewAdminPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Admin PIN */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm New Admin PIN
                </label>
                <div className="relative">
                  <input
                    type={showConfirmAdminPin ? 'text' : 'password'}
                    value={confirmAdminPin}
                    onChange={(e) => setConfirmAdminPin(e.target.value)}
                    className="w-full bg-[#282828] border border-[#404040] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#CB6015]"
                    placeholder="Confirm new PIN"
                    maxLength="4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmAdminPin(!showConfirmAdminPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    {showConfirmAdminPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#CB6015] hover:bg-[#d86b1a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Updating...' : 'Update Admin PIN'}
              </button>
            </form>
          </div>

          {/* Wholesale PIN Section */}
          <div className="bg-[#181818] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Key className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Wholesale PIN</h2>
                <p className="text-sm text-[#b3b3b3]">Change the PIN for wholesale page access</p>
              </div>
            </div>

            {/* Success/Error Messages */}
            {wholesaleSuccess && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-500/20 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">{wholesaleSuccess}</span>
              </div>
            )}
            
            {wholesaleError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center gap-2">
                <X className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{wholesaleError}</span>
              </div>
            )}

            <form onSubmit={handleWholesalePinChange} className="space-y-4">
              {/* Current Wholesale PIN */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Current Wholesale PIN
                </label>
                <div className="relative">
                  <input
                    type={showCurrentWholesalePin ? 'text' : 'password'}
                    value={currentWholesalePin}
                    onChange={(e) => setCurrentWholesalePin(e.target.value)}
                    className="w-full bg-[#282828] border border-[#404040] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#CB6015]"
                    placeholder="Enter current PIN"
                    maxLength="4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentWholesalePin(!showCurrentWholesalePin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    {showCurrentWholesalePin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Wholesale PIN */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  New Wholesale PIN
                </label>
                <div className="relative">
                  <input
                    type={showNewWholesalePin ? 'text' : 'password'}
                    value={newWholesalePin}
                    onChange={(e) => setNewWholesalePin(e.target.value)}
                    className="w-full bg-[#282828] border border-[#404040] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#CB6015]"
                    placeholder="Enter new 4-digit PIN"
                    maxLength="4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewWholesalePin(!showNewWholesalePin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    {showNewWholesalePin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Wholesale PIN */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm New Wholesale PIN
                </label>
                <div className="relative">
                  <input
                    type={showConfirmWholesalePin ? 'text' : 'password'}
                    value={confirmWholesalePin}
                    onChange={(e) => setConfirmWholesalePin(e.target.value)}
                    className="w-full bg-[#282828] border border-[#404040] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#CB6015]"
                    placeholder="Confirm new PIN"
                    maxLength="4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmWholesalePin(!showConfirmWholesalePin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    {showConfirmWholesalePin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                {loading ? 'Updating...' : 'Update Wholesale PIN'}
              </button>
            </form>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-[#181818] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Security Information</h3>
          <div className="space-y-3 text-sm text-[#b3b3b3]">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#CB6015] rounded-full mt-2 flex-shrink-0" />
              <p>PIN passwords must be exactly 4 digits (0-9)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#CB6015] rounded-full mt-2 flex-shrink-0" />
              <p>Admin PIN controls access to the admin dashboard</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#CB6015] rounded-full mt-2 flex-shrink-0" />
              <p>Wholesale PIN controls access to the wholesale ordering page</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#CB6015] rounded-full mt-2 flex-shrink-0" />
              <p>Changes are immediately synced to Firebase and applied system-wide</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#CB6015] rounded-full mt-2 flex-shrink-0" />
              <p>Use the eye icon to toggle PIN visibility when entering</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordsManagement;