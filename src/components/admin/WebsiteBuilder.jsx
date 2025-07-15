import { useState, useEffect } from 'react';
import { usePageContent } from '../../context/PageContentContext';
import { 
  Globe, Video, Image, Type, Link as LinkIcon, Save, RefreshCw, 
  ChevronDown, ChevronUp, Eye, EyeOff, Upload, AlertCircle,
  Home, ShoppingBag, Users, Phone, Info, Plus, Trash2, Edit3
} from 'lucide-react';

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
  const [tempContent, setTempContent] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Page configurations
  const pages = [
    { id: 'home', name: 'Homepage', icon: Home },
    { id: 'about', name: 'About Us', icon: Info },
    { id: 'shop', name: 'Shop', icon: ShoppingBag },
    { id: 'wholesale', name: 'Wholesale', icon: Users },
    { id: 'contact', name: 'Contact', icon: Phone }
  ];

  // Get current page data
  const currentPageData = pageContent[selectedPage] || {};

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Start editing a section
  const startEditing = (sectionId) => {
    setEditingSection(sectionId);
    setTempContent(currentPageData[sectionId] || {});
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSection(null);
    setTempContent({});
  };

  // Save section changes
  const saveSection = async () => {
    if (!editingSection) return;

    const success = await updatePageContent(selectedPage, editingSection, tempContent);
    
    if (success) {
      setSuccessMessage('Section updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingSection(null);
      setTempContent({});
    } else {
      setErrorMessage('Failed to update section. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setTempContent({
      ...tempContent,
      [field]: value
    });
  };

  // Handle array field changes (for items)
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

  // Add new item to array
  const addArrayItem = () => {
    const items = [...(tempContent.items || [])];
    items.push({ title: '', description: '' });
    setTempContent({
      ...tempContent,
      items
    });
  };

  // Remove item from array
  const removeArrayItem = (index) => {
    const items = [...(tempContent.items || [])];
    items.splice(index, 1);
    setTempContent({
      ...tempContent,
      items
    });
  };

  // Render field editor based on type
  const renderFieldEditor = (field, value, label) => {
    const fieldType = field.includes('Url') || field.includes('Link') ? 'url' : 
                     field.includes('description') || field.includes('Description') ? 'textarea' : 
                     'text';

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
          {label || field.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        {fieldType === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
            rows="3"
          />
        ) : (
          <input
            type={fieldType}
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder={fieldType === 'url' ? 'https://...' : ''}
          />
        )}
      </div>
    );
  };

  // Render section content editor
  const renderSectionEditor = () => {
    if (!editingSection || !tempContent) return null;

    return (
      <div className="bg-spotify-gray rounded-xl p-6 space-y-4">
        {/* Check if section has items array */}
        {tempContent.items ? (
          <>
            {/* Render non-array fields */}
            {Object.entries(tempContent).map(([field, value]) => {
              if (field === 'items') return null;
              return (
                <div key={field}>
                  {renderFieldEditor(field, value)}
                </div>
              );
            })}

            {/* Render items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Items</h4>
                <button
                  onClick={addArrayItem}
                  className="flex items-center gap-2 px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              
              {tempContent.items.map((item, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-medium">Item {index + 1}</h5>
                    <button
                      onClick={() => removeArrayItem(index)}
                      className="p-1 hover:bg-red-600/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  
                  {Object.entries(item).map(([field, value]) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleArrayFieldChange(index, field, e.target.value)}
                        className="w-full bg-spotify-gray text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          // Render all fields for non-array sections
          Object.entries(tempContent).map(([field, value]) => (
            <div key={field}>
              {renderFieldEditor(field, value)}
            </div>
          ))
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={saveSection}
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={cancelEditing}
            className="flex-1 bg-spotify-light-gray hover:bg-spotify-card-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Render section preview
  const renderSectionPreview = (sectionId, sectionData) => {
    return (
      <div className="bg-black/30 rounded-lg p-4 space-y-2">
        {Object.entries(sectionData).map(([field, value]) => {
          if (field === 'items' && Array.isArray(value)) {
            return (
              <div key={field} className="space-y-2">
                <p className="text-sm font-medium text-gray-400">Items:</p>
                {value.map((item, index) => (
                  <div key={index} className="pl-4 text-sm">
                    <p className="text-gray-300">• {item.title || 'Untitled'}</p>
                  </div>
                ))}
              </div>
            );
          }

          if (typeof value === 'object') return null;

          return (
            <div key={field} className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-400 capitalize min-w-[100px]">
                {field.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="text-sm text-gray-300 break-all">
                {value || 'Not set'}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading page content...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Website Builder</h1>
          <p className="text-gray-400">Manage content across all pages of your website</p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('This will reset all pages to their default content. Are you sure?')) {
              resetToDefaults();
            }
          }}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selector */}
        <div className="lg:col-span-1">
          <div className="bg-spotify-light-gray rounded-xl p-4">
            <h3 className="text-white font-medium mb-4">Pages</h3>
            <div className="space-y-2">
              {pages.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      selectedPage === page.id
                        ? 'bg-primary text-white'
                        : 'bg-spotify-gray hover:bg-spotify-card-hover text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{page.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Page Title */}
          <div className="bg-spotify-light-gray rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              {pages.find(p => p.id === selectedPage)?.name} Page Content
            </h2>

            {/* Sections */}
            <div className="space-y-4">
              {Object.entries(currentPageData).map(([sectionId, sectionData]) => (
                <div key={sectionId} className="bg-spotify-gray rounded-xl overflow-hidden">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(sectionId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-spotify-card-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        {sectionData.videoUrl ? <Video className="w-4 h-4 text-primary" /> :
                         sectionData.imageUrl ? <Image className="w-4 h-4 text-primary" /> :
                         <Type className="w-4 h-4 text-primary" />}
                      </div>
                      <h3 className="text-white font-medium capitalize">
                        {sectionId.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </div>
                    {expandedSections.has(sectionId) ? 
                      <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </button>

                  {/* Section Content */}
                  {expandedSections.has(sectionId) && (
                    <div className="p-4 border-t border-spotify-light-gray">
                      {editingSection === sectionId ? (
                        renderSectionEditor()
                      ) : (
                        <>
                          {renderSectionPreview(sectionId, sectionData)}
                          <button
                            onClick={() => startEditing(sectionId)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Section
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;