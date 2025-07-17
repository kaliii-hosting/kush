import { useState } from 'react';
import { useLogos } from '../../context/LogosContext';
import { 
  Monitor, Smartphone, FileText, ShieldCheck, Settings,
  Save, RefreshCw, Image, Upload, Link
} from 'lucide-react';

const LogosManagement = () => {
  const { logos, loading, saving, updateLogo, resetToDefaults } = useLogos();
  const [editingLogo, setEditingLogo] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const logoSections = [
    { 
      id: 'desktop', 
      name: 'Desktop Logo', 
      description: 'Main logo shown in desktop navigation',
      icon: Monitor,
      preview: 'bg-black'
    },
    { 
      id: 'mobile', 
      name: 'Mobile Logo', 
      description: 'Compact logo for mobile devices',
      icon: Smartphone,
      preview: 'bg-black'
    },
    { 
      id: 'footer', 
      name: 'Footer Logo', 
      description: 'Logo displayed in the website footer',
      icon: FileText,
      preview: 'bg-spotify-gray'
    },
    { 
      id: 'ageVerification', 
      name: 'Age Verification Logo', 
      description: 'Logo shown on the age verification popup',
      icon: ShieldCheck,
      preview: 'bg-black'
    },
    { 
      id: 'adminDashboard', 
      name: 'Admin Dashboard Logo', 
      description: 'Logo for the admin panel sidebar',
      icon: Settings,
      preview: 'bg-black'
    }
  ];

  const startEditing = (logoType) => {
    setEditingLogo(logoType);
    setTempData({ ...logos[logoType] });
  };

  const cancelEditing = () => {
    setEditingLogo(null);
    setTempData(null);
  };

  const handleFieldChange = (field, value) => {
    setTempData({
      ...tempData,
      [field]: value
    });
  };

  const saveLogo = async () => {
    if (!editingLogo || !tempData) return;

    const success = await updateLogo(editingLogo, tempData);
    if (success) {
      setSuccessMessage('Logo updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      cancelEditing();
    } else {
      setErrorMessage('Failed to update logo. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('This will reset all logos to their defaults. Are you sure?')) {
      const success = await resetToDefaults();
      if (success) {
        setSuccessMessage('Logos reset to defaults successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to reset logos.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading logos configuration...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Logo Management</h1>
          <p className="text-gray-400">Manage logos across different sections of your website</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Logo Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {logoSections.map((section) => {
          const Icon = section.icon;
          const logoData = logos[section.id];
          const isEditing = editingLogo === section.id;

          return (
            <div key={section.id} className="bg-spotify-light-gray rounded-xl overflow-hidden">
              {/* Section Header */}
              <div className="p-6 border-b border-spotify-gray">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{section.name}</h3>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Logo URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={tempData.url || ''}
                          onChange={(e) => handleFieldChange('url', e.target.value)}
                          className="flex-1 bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                          placeholder="https://..."
                        />
                        <button
                          className="p-2 bg-spotify-gray hover:bg-spotify-card-hover rounded-lg transition-colors"
                          title="Upload to storage"
                        >
                          <Upload className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={tempData.alt || ''}
                        onChange={(e) => handleFieldChange('alt', e.target.value)}
                        className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Logo description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Width
                        </label>
                        <input
                          type="text"
                          value={tempData.width || ''}
                          onChange={(e) => handleFieldChange('width', e.target.value)}
                          className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                          placeholder="auto or px value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Height
                        </label>
                        <input
                          type="text"
                          value={tempData.height || ''}
                          onChange={(e) => handleFieldChange('height', e.target.value)}
                          className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                          placeholder="auto or px value"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={saveLogo}
                        disabled={saving}
                        className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 bg-spotify-gray hover:bg-spotify-card-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    {/* Preview */}
                    <div className={`${section.preview} rounded-lg p-6 flex items-center justify-center`}>
                      {logoData.url ? (
                        <img 
                          src={logoData.url} 
                          alt={logoData.alt || 'Logo preview'}
                          style={{
                            width: logoData.width === 'auto' ? 'auto' : `${logoData.width}px`,
                            height: logoData.height === 'auto' ? 'auto' : `${logoData.height}px`,
                            maxWidth: '100%',
                            maxHeight: '80px'
                          }}
                          className="object-contain"
                        />
                      ) : (
                        <div className="text-gray-500 flex flex-col items-center gap-2">
                          <Image className="w-8 h-8" />
                          <span className="text-sm">No logo set</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Link className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-gray-400">URL: </span>
                          <span className="text-gray-300 break-all">
                            {logoData.url || 'Not set'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Dimensions: </span>
                        <span className="text-gray-300">
                          {logoData.width} × {logoData.height}
                        </span>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => startEditing(section.id)}
                      className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Edit Logo
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogosManagement;