import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Shield, Bell, MapPin, CreditCard, Settings, Check, X } from 'lucide-react';

const Account = () => {
  const { user, userData, updateUserProfile, changePassword, resetPassword, updateUserPreferences } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        dateOfBirth: ''
      });
    }
    
    // Load user preferences from Firestore
    if (userData?.preferences) {
      setNotifications({
        email: userData.preferences.email ?? true,
        sms: userData.preferences.sms ?? false,
        push: userData.preferences.push ?? true,
        marketing: userData.preferences.marketing ?? false
      });
    }
  }, [user, userData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        displayName: profileData.displayName
      });
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await changePassword(passwordData.newPassword);
      showMessage('success', 'Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      showMessage('error', 'No email address found');
      return;
    }
    
    setLoading(true);
    
    try {
      await resetPassword(user.email);
      showMessage('success', 'Password reset email sent to ' + user.email);
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key, value) => {
    try {
      const newNotifications = { ...notifications, [key]: value };
      setNotifications(newNotifications);
      
      await updateUserPreferences(newNotifications);
      showMessage('success', 'Notification preferences updated!');
    } catch (error) {
      showMessage('error', error.message);
      // Revert the change if it failed
      setNotifications(notifications);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-spotify-text-subdued">You need to be logged in to access your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-spotify-light-gray to-black border-b border-spotify-card-hover">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">My Account</h1>
              <p className="text-spotify-text-subdued">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-spotify-text-subdued hover:text-white hover:bg-spotify-card-hover'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-spotify-light-gray rounded-xl p-6 md:p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Display Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-spotify-text-subdued" />
                          <input
                            type="text"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-spotify-gray border border-spotify-card-hover rounded-lg text-white placeholder-spotify-text-subdued focus:outline-none focus:border-primary"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-spotify-text-subdued" />
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="w-full pl-10 pr-4 py-3 bg-spotify-gray border border-spotify-card-hover rounded-lg text-spotify-text-subdued cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-spotify-text-subdued mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                  
                  {/* Change Password */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-spotify-text-subdued" />
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 bg-spotify-gray border border-spotify-card-hover rounded-lg text-white placeholder-spotify-text-subdued focus:outline-none focus:border-primary"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-text-subdued hover:text-white"
                          >
                            {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-spotify-text-subdued" />
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full pl-10 pr-12 py-3 bg-spotify-gray border border-spotify-card-hover rounded-lg text-white placeholder-spotify-text-subdued focus:outline-none focus:border-primary"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-text-subdued hover:text-white"
                            >
                              {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-spotify-text-subdued" />
                            <input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              className="w-full pl-10 pr-12 py-3 bg-spotify-gray border border-spotify-card-hover rounded-lg text-white placeholder-spotify-text-subdued focus:outline-none focus:border-primary"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-text-subdued hover:text-white"
                            >
                              {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Change Password'}
                        </button>
                        <button
                          type="button"
                          onClick={handlePasswordReset}
                          disabled={loading}
                          className="bg-spotify-gray hover:bg-spotify-card-hover text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Send Reset Email
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium capitalize">{key} Notifications</h3>
                          <p className="text-sm text-spotify-text-subdued">
                            Receive {key} notifications about orders, promotions, and updates
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary' : 'bg-spotify-gray'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Account Preferences</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-white font-medium mb-2">Account Status</h3>
                      <p className="text-sm text-spotify-text-subdued mb-4">
                        Your account is active and verified
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 text-sm">Active</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-spotify-gray rounded-lg">
                      <h3 className="text-white font-medium mb-2">Member Since</h3>
                      <p className="text-spotify-text-subdued">
                        {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;