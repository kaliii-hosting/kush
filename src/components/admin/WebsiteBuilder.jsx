import { useState, useEffect } from 'react';
import { usePageContent } from '../../context/PageContentContext';
import { 
  Home, Info, ShoppingBag, Package2, Phone, 
  Globe, ChevronDown, ChevronUp, Save, X, 
  Edit3, Plus, Trash2, RefreshCw, Video, 
  Image, Type, Link as LinkIcon, Palette,
  Grid, Layout, FileText, Sparkles, Package, Columns, GripVertical,
  MoreHorizontal, Play, Eye, EyeOff, Filter, CheckCircle
} from 'lucide-react';

// Page configuration
const pages = [
  { id: 'home', name: 'Home', icon: Home, editable: true },
  { id: 'about', name: 'About', icon: Info, editable: true },
  { id: 'shop', name: 'Shop', icon: ShoppingBag, editable: false },
  { id: 'wholesale', name: 'Wholesale', icon: Package2, editable: true },
  { id: 'contact', name: 'Contact', icon: Phone, editable: true }
];

// Spotify-style Section Component
const SpotifySection = ({ 
  sectionKey,
  section, 
  pageId,
  isExpanded,
  isEditing,
  onToggle,
  onStartEdit,
  onDelete,
  renderEditor,
  renderPreview
}) => {
  const getSectionIcon = () => {
    if (section.items) return Grid;
    if (section.videoUrl || section.videoBackground) return Video;
    if (section.imageUrl || section.backgroundImage) return Image;
    return Type;
  };

  const Icon = getSectionIcon();
  
  // Check if section is editable
  const isEditable = pageId !== 'shop' && !(pageId === 'about' && sectionKey === 'hero');

  // Format section name
  const formatSectionName = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="bg-[#181818] rounded-lg overflow-hidden hover:bg-[#282828] transition-all duration-200">
      {/* Section Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex-1 flex items-center gap-4 text-left group"
          >
            <div className="p-3 bg-[#282828] rounded-md group-hover:bg-[#3e3e3e] transition-colors">
              <Icon className="w-5 h-5 text-[#b3b3b3]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">{formatSectionName(sectionKey)}</h3>
              <p className="text-sm text-[#b3b3b3]">
                {isEditable ? 'Click to edit' : 'Read-only section'}
              </p>
            </div>
            {isExpanded ? 
              <ChevronUp className="w-5 h-5 text-[#b3b3b3]" /> : 
              <ChevronDown className="w-5 h-5 text-[#b3b3b3]" />
            }
          </button>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="border-t border-[#282828]">
          {isEditing ? (
            <div className="p-6 bg-black/20">
              {renderEditor()}
            </div>
          ) : (
            <div className="p-6">
              {renderPreview()}
              {isEditable && (
                <button
                  onClick={onStartEdit}
                  className="mt-4 w-full bg-spotify-green hover:bg-spotify-green-hover text-black font-medium py-3 px-4 rounded-full transition-all transform hover:scale-105"
                >
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Edit Section
                </button>
              )}
              {!isEditable && (
                <div className="mt-4 text-center text-sm text-[#b3b3b3]">
                  This section cannot be edited
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const WebsiteBuilder = () => {
  const { 
    pageContent, 
    loading, 
    saving, 
    updatePageContent,
    updateEntirePage,
    resetToDefaults 
  } = usePageContent();

  const [selectedPage, setSelectedPage] = useState('home');
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [editingSection, setEditingSection] = useState(null);
  const [tempContent, setTempContent] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Get current page data
  const currentPageData = pageContent[selectedPage] || {};
  const currentPage = pages.find(p => p.id === selectedPage);

  // Get sections as array for easier handling
  const sections = Object.entries(currentPageData).map(([key, value]) => ({
    key,
    ...value
  }));

  // Toggle section expansion
  const toggleSection = (sectionKey) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  // Start editing
  const startEditing = (sectionKey) => {
    const sectionData = currentPageData[sectionKey];
    if (sectionData) {
      setTempContent({ ...sectionData });
      setEditingSection(sectionKey);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSection(null);
    setTempContent(null);
  };

  // Save section
  const saveSection = async () => {
    if (!editingSection || !tempContent) return;

    try {
      const success = await updatePageContent(selectedPage, editingSection, tempContent);
      if (success) {
        setConfirmationMessage('Changes saved successfully!');
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          setConfirmationMessage('');
        }, 3000);
        cancelEditing();
      } else {
        setErrorMessage('Failed to save changes.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving section:', error);
      setErrorMessage('Failed to save changes. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Handle field change
  const handleFieldChange = (field, value) => {
    setTempContent({
      ...tempContent,
      [field]: value
    });
  };

  // Handle array field change (for items)
  const handleArrayFieldChange = (index, field, value) => {
    const items = [...(tempContent.items || [])];
    items[index] = {
      ...items[index],
      [field]: value
    };
    setTempContent({
      ...tempContent,
      items
    });
  };

  // Add array item
  const addArrayItem = () => {
    const items = [...(tempContent.items || [])];
    items.push({ title: '', description: '' });
    setTempContent({
      ...tempContent,
      items
    });
  };

  // Remove array item
  const removeArrayItem = (index) => {
    const items = [...(tempContent.items || [])];
    items.splice(index, 1);
    setTempContent({
      ...tempContent,
      items
    });
  };

  // Render field editor
  const renderFieldEditor = (field, value, label, type = 'text') => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#b3b3b3] mb-2">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full bg-[#242424] text-white px-4 py-3 rounded-md border border-[#3e3e3e] focus:border-spotify-green focus:outline-none resize-none"
            rows="3"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full bg-[#242424] text-white px-4 py-3 rounded-md border border-[#3e3e3e] focus:border-spotify-green focus:outline-none"
            placeholder={type === 'url' ? 'https://...' : `Enter ${label.toLowerCase()}`}
          />
        )}
      </div>
    );
  };

  // Render section editor
  const renderSectionEditor = () => {
    if (!editingSection || !tempContent) return null;

    const editableFields = [
      { field: 'title', label: 'Title', type: 'text' },
      { field: 'subtitle', label: 'Subtitle', type: 'text' },
      { field: 'description', label: 'Description', type: 'textarea' },
      { field: 'buttonText', label: 'Button Text', type: 'text' },
      { field: 'buttonLink', label: 'Button Link', type: 'url' },
      { field: 'videoUrl', label: 'Video URL', type: 'url' },
      { field: 'imageUrl', label: 'Image URL', type: 'url' },
      { field: 'backgroundImage', label: 'Background Image URL', type: 'url' },
      { field: 'email', label: 'Email', type: 'email' },
      { field: 'phone', label: 'Phone', type: 'tel' },
      { field: 'hours', label: 'Hours', type: 'text' },
    ];

    return (
      <div>
        {editableFields.map(({ field, label, type }) => {
          if (tempContent[field] !== undefined) {
            return (
              <div key={field}>
                {renderFieldEditor(field, tempContent[field], label, type)}
              </div>
            );
          }
          return null;
        })}

        {/* Handle items array */}
        {tempContent.items && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-[#b3b3b3]">Items</label>
              <button
                onClick={addArrayItem}
                className="bg-[#282828] hover:bg-[#3e3e3e] text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Item
              </button>
            </div>
            <div className="space-y-4">
              {tempContent.items.map((item, index) => (
                <div key={index} className="bg-[#242424] rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-medium">Item {index + 1}</h5>
                    <button
                      onClick={() => removeArrayItem(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleArrayFieldChange(index, 'title', e.target.value)}
                    placeholder="Title"
                    className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-md border border-[#3e3e3e] focus:border-spotify-green focus:outline-none"
                  />
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => handleArrayFieldChange(index, 'description', e.target.value)}
                    placeholder="Description"
                    rows="2"
                    className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-md border border-[#3e3e3e] focus:border-spotify-green focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={saveSection}
            disabled={saving}
            className="flex-1 bg-spotify-green hover:bg-spotify-green-hover text-black font-medium py-3 px-4 rounded-full transition-all transform hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={cancelEditing}
            className="flex-1 bg-[#282828] hover:bg-[#3e3e3e] text-white font-medium py-3 px-4 rounded-full transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Render section preview
  const renderSectionPreview = (sectionKey, section) => {
    const fields = [
      { field: 'title', label: 'Title', icon: Type },
      { field: 'subtitle', label: 'Subtitle', icon: Type },
      { field: 'description', label: 'Description', icon: FileText },
      { field: 'buttonText', label: 'Button', icon: Play },
      { field: 'buttonLink', label: 'Button Link', icon: LinkIcon },
      { field: 'videoUrl', label: 'Video URL', icon: Video },
      { field: 'imageUrl', label: 'Image', icon: Image },
      { field: 'backgroundImage', label: 'Background Image', icon: Image },
      { field: 'email', label: 'Email', icon: Type },
      { field: 'phone', label: 'Phone', icon: Phone },
      { field: 'hours', label: 'Hours', icon: Type },
    ];

    return (
      <div className="space-y-4">
        {fields.map(({ field, label, icon: Icon }) => {
          if (section[field] !== undefined) {
            return (
              <div key={field} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-[#b3b3b3] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-[#b3b3b3]">{label}</p>
                  <p className="text-white">{section[field] || 'Not set'}</p>
                </div>
              </div>
            );
          }
          return null;
        })}

        {section.items && (
          <div className="space-y-2">
            <p className="text-sm text-[#b3b3b3] flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Items ({section.items.length})
            </p>
            <div className="pl-7 space-y-2">
              {section.items.map((item, index) => (
                <div key={index} className="bg-[#282828] rounded-md p-3">
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-sm text-[#b3b3b3]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-spotify-green border-t-transparent"></div>
      </div>
    );
  }

  // Confirmation Popup Component
  const ConfirmationPopup = () => {
    if (!showConfirmation) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Popup */}
        <div className="relative bg-[#282828] rounded-lg p-6 sm:p-8 max-w-sm w-full transform transition-all duration-300 scale-100 animate-pulse-once">
          <div className="flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="mb-4 p-4 bg-spotify-green/20 rounded-full">
              <CheckCircle className="w-12 h-12 text-spotify-green" />
            </div>
            
            {/* Message */}
            <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
            <p className="text-[#b3b3b3] text-sm">{confirmationMessage}</p>
            
            {/* Loading bar */}
            <div className="mt-6 w-full h-1 bg-[#404040] rounded-full overflow-hidden">
              <div className="h-full bg-spotify-green rounded-full animate-shrink-width" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Confirmation Popup */}
      <ConfirmationPopup />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Website Builder</h1>
        <p className="text-[#b3b3b3]">Customize your website content and layout</p>
      </div>

      {/* Success/Error Messages */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selector */}
        <div className="lg:col-span-1">
          <div className="bg-[#181818] rounded-lg p-2">
            <div className="p-4 border-b border-[#282828]">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Pages
              </h3>
            </div>
            <div className="p-2">
              {pages.map((page) => {
                const Icon = page.icon;
                const isActive = selectedPage === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                      isActive
                        ? 'bg-[#282828] text-white'
                        : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left font-medium">{page.name}</span>
                    {!page.editable && (
                      <span className="text-xs bg-[#282828] px-2 py-1 rounded">Read-only</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-[#181818] rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="w-full flex items-center gap-3 px-4 py-2 bg-[#282828] hover:bg-[#3e3e3e] text-white rounded-md transition-colors"
              >
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Reset all pages to default content?')) {
                    const success = await resetToDefaults();
                    if (success) {
                      setConfirmationMessage('All pages reset to defaults!');
                      setShowConfirmation(true);
                      setTimeout(() => {
                        setShowConfirmation(false);
                        setConfirmationMessage('');
                      }, 3000);
                    }
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-[#181818] rounded-lg">
            {/* Page Header */}
            <div className="p-6 border-b border-[#282828]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {currentPage && (
                      <>
                        <currentPage.icon className="w-6 h-6" />
                        {currentPage.name} Page
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-[#b3b3b3] mt-1">
                    {currentPage?.editable ? 'Click on sections to edit content' : 'This page is read-only'}
                  </p>
                </div>
                <button className="text-[#b3b3b3] hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sections List */}
            <div className="p-6">
              {sections.length === 0 ? (
                <div className="text-center py-12">
                  <Grid className="w-12 h-12 text-[#b3b3b3] mx-auto mb-4" />
                  <p className="text-[#b3b3b3]">No content available for this page</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map(({ key, ...section }) => (
                    <SpotifySection
                      key={key}
                      sectionKey={key}
                      section={section}
                      pageId={selectedPage}
                      isExpanded={expandedSections.has(key)}
                      isEditing={editingSection === key}
                      onToggle={() => toggleSection(key)}
                      onStartEdit={() => startEditing(key)}
                      renderEditor={renderSectionEditor}
                      renderPreview={() => renderSectionPreview(key, section)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;