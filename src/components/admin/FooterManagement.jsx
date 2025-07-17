import { useState } from 'react';
import { usePageContent } from '../../context/PageContentContext';
import { 
  FileText, Plus, Trash2, Edit3, Save, X, 
  Link, Mail, Facebook, Instagram, Twitter,
  Youtube, Globe, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';

const FooterManagement = () => {
  const { pageContent, loading, saving, updateSection, defaultPageContent } = usePageContent();
  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set(['newsletter', 'columns', 'social', 'bottom']));
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Find footer section from any page (prioritize home page)
  const footerSection = pageContent?.home?.sections?.find(s => s.type === 'footer') || 
                       pageContent?.about?.sections?.find(s => s.type === 'footer') ||
                       defaultPageContent?.home?.sections?.find(s => s.type === 'footer');

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const startEditing = (field) => {
    setEditingField(field);
    if (field === 'newsletter') {
      setTempData({ ...footerSection.newsletter });
    } else if (field === 'columns') {
      setTempData([...footerSection.columns]);
    } else if (field === 'socialLinks') {
      setTempData([...footerSection.socialLinks]);
    } else if (field === 'bottom') {
      setTempData({
        copyright: footerSection.copyright,
        bottomLinks: footerSection.bottomLinks ? [...footerSection.bottomLinks] : []
      });
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempData(null);
  };

  const saveChanges = async () => {
    if (!editingField || !tempData) return;

    let updates = {};
    if (editingField === 'newsletter') {
      updates.newsletter = tempData;
    } else if (editingField === 'columns') {
      updates.columns = tempData;
    } else if (editingField === 'socialLinks') {
      updates.socialLinks = tempData;
    } else if (editingField === 'bottom') {
      updates.copyright = tempData.copyright;
      updates.bottomLinks = tempData.bottomLinks;
    }

    const success = await updateSection('home', footerSection.id, updates);
    if (success) {
      setSuccessMessage('Footer updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      cancelEditing();
    } else {
      setErrorMessage('Failed to update footer. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('This will reset the footer to default content. Are you sure?')) {
      const defaultFooter = defaultPageContent.home.sections.find(s => s.type === 'footer');
      const success = await updateSection('home', footerSection.id, defaultFooter);
      if (success) {
        setSuccessMessage('Footer reset to defaults successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to reset footer.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  // Social platform icons mapping
  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    default: Globe
  };

  if (loading || !footerSection) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">
          {loading ? 'Loading footer content...' : 'No footer section found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Footer Management</h1>
          <p className="text-gray-400">Manage all footer content including links, newsletter, and social media</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Default
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

      {/* Newsletter Section */}
      <div className="bg-spotify-light-gray rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => toggleSection('newsletter')}
          className="w-full p-6 flex items-center justify-between hover:bg-spotify-gray/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Newsletter Section</h3>
              <p className="text-sm text-gray-400">Manage newsletter signup form</p>
            </div>
          </div>
          {expandedSections.has('newsletter') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('newsletter') && (
          <div className="p-6 border-t border-spotify-gray">
            {editingField === 'newsletter' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={tempData.title || ''}
                    onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                    className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={tempData.description || ''}
                    onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                    className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Placeholder Text</label>
                  <input
                    type="text"
                    value={tempData.placeholder || ''}
                    onChange={(e) => setTempData({ ...tempData, placeholder: e.target.value })}
                    className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={tempData.buttonText || ''}
                    onChange={(e) => setTempData({ ...tempData, buttonText: e.target.value })}
                    className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={saveChanges}
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
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{footerSection.newsletter?.title || 'Newsletter Title'}</h4>
                  <p className="text-gray-400 text-sm mb-3">{footerSection.newsletter?.description || 'Newsletter description'}</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder={footerSection.newsletter?.placeholder || 'Enter your email'}
                      className="flex-1 bg-spotify-gray text-white px-4 py-2 rounded-full text-sm"
                      disabled
                    />
                    <button className="bg-primary text-white px-6 py-2 rounded-full text-sm" disabled>
                      {footerSection.newsletter?.buttonText || 'Subscribe'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => startEditing('newsletter')}
                  className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit Newsletter
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Columns */}
      <div className="bg-spotify-light-gray rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => toggleSection('columns')}
          className="w-full p-6 flex items-center justify-between hover:bg-spotify-gray/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Footer Columns</h3>
              <p className="text-sm text-gray-400">Manage footer link columns</p>
            </div>
          </div>
          {expandedSections.has('columns') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('columns') && (
          <div className="p-6 border-t border-spotify-gray">
            {editingField === 'columns' ? (
              <div className="space-y-4">
                {tempData.map((column, colIndex) => (
                  <div key={column.id} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={column.title || ''}
                        onChange={(e) => {
                          const newColumns = [...tempData];
                          newColumns[colIndex] = { ...column, title: e.target.value };
                          setTempData(newColumns);
                        }}
                        className="bg-spotify-gray text-white px-3 py-1 rounded font-medium"
                        placeholder="Column Title"
                      />
                      <button
                        onClick={() => {
                          setTempData(tempData.filter((_, i) => i !== colIndex));
                        }}
                        className="p-1 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {column.links?.map((link, linkIndex) => (
                        <div key={linkIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={link.text || ''}
                            placeholder="Link text"
                            onChange={(e) => {
                              const newColumns = [...tempData];
                              newColumns[colIndex].links[linkIndex] = { 
                                ...link, 
                                text: e.target.value 
                              };
                              setTempData(newColumns);
                            }}
                            className="flex-1 bg-spotify-gray text-white px-2 py-1 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={link.url || ''}
                            placeholder="URL"
                            onChange={(e) => {
                              const newColumns = [...tempData];
                              newColumns[colIndex].links[linkIndex] = { 
                                ...link, 
                                url: e.target.value 
                              };
                              setTempData(newColumns);
                            }}
                            className="flex-1 bg-spotify-gray text-white px-2 py-1 rounded text-sm"
                          />
                          <button
                            onClick={() => {
                              const newColumns = [...tempData];
                              newColumns[colIndex].links = newColumns[colIndex].links.filter((_, i) => i !== linkIndex);
                              setTempData(newColumns);
                            }}
                            className="p-1 hover:bg-red-600/20 rounded transition-colors"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newColumns = [...tempData];
                          if (!newColumns[colIndex].links) newColumns[colIndex].links = [];
                          newColumns[colIndex].links.push({ text: '', url: '' });
                          setTempData(newColumns);
                        }}
                        className="text-sm text-primary hover:text-primary-hover"
                      >
                        + Add Link
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    setTempData([...tempData, {
                      id: `column_${Date.now()}`,
                      title: 'New Column',
                      links: [{ text: 'Link', url: '#' }]
                    }]);
                  }}
                  className="w-full p-4 border-2 border-dashed border-spotify-gray rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <Plus className="w-5 h-5 mx-auto mb-1" />
                  Add New Column
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={saveChanges}
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {footerSection.columns?.map((column) => (
                    <div key={column.id} className="bg-black/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">{column.title}</h4>
                      <ul className="space-y-1">
                        {column.links?.slice(0, 4).map((link, index) => (
                          <li key={index} className="text-sm text-gray-400">{link.text}</li>
                        ))}
                        {column.links?.length > 4 && (
                          <li className="text-sm text-gray-500">+{column.links.length - 4} more</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => startEditing('columns')}
                  className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit Columns
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="bg-spotify-light-gray rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => toggleSection('social')}
          className="w-full p-6 flex items-center justify-between hover:bg-spotify-gray/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Social Media Links</h3>
              <p className="text-sm text-gray-400">Manage social media profiles</p>
            </div>
          </div>
          {expandedSections.has('social') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('social') && (
          <div className="p-6 border-t border-spotify-gray">
            {editingField === 'socialLinks' ? (
              <div className="space-y-4">
                {tempData.map((social, index) => {
                  const Icon = socialIcons[social.platform] || socialIcons.default;
                  return (
                    <div key={index} className="flex gap-2">
                      <div className="p-2 bg-spotify-gray rounded">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={social.platform || ''}
                        placeholder="Platform (e.g., instagram)"
                        onChange={(e) => {
                          const newSocial = [...tempData];
                          newSocial[index] = { ...social, platform: e.target.value };
                          setTempData(newSocial);
                        }}
                        className="flex-1 bg-spotify-gray text-white px-3 py-2 rounded-lg"
                      />
                      <input
                        type="url"
                        value={social.url || ''}
                        placeholder="URL"
                        onChange={(e) => {
                          const newSocial = [...tempData];
                          newSocial[index] = { ...social, url: e.target.value };
                          setTempData(newSocial);
                        }}
                        className="flex-1 bg-spotify-gray text-white px-3 py-2 rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setTempData(tempData.filter((_, i) => i !== index));
                        }}
                        className="p-2 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  );
                })}
                
                <button
                  onClick={() => {
                    setTempData([...tempData, { platform: '', url: '' }]);
                  }}
                  className="w-full p-4 border-2 border-dashed border-spotify-gray rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <Plus className="w-5 h-5 mx-auto mb-1" />
                  Add Social Link
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={saveChanges}
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
              <div className="space-y-4">
                <div className="flex gap-4">
                  {footerSection.socialLinks?.map((social, index) => {
                    const Icon = socialIcons[social.platform] || socialIcons.default;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-black/30 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </a>
                    );
                  })}
                </div>
                <button
                  onClick={() => startEditing('socialLinks')}
                  className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit Social Links
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Copyright & Bottom Links */}
      <div className="bg-spotify-light-gray rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('bottom')}
          className="w-full p-6 flex items-center justify-between hover:bg-spotify-gray/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Copyright & Bottom Links</h3>
              <p className="text-sm text-gray-400">Manage copyright text and legal links</p>
            </div>
          </div>
          {expandedSections.has('bottom') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('bottom') && (
          <div className="p-6 border-t border-spotify-gray">
            {editingField === 'bottom' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Copyright Text</label>
                  <input
                    type="text"
                    value={tempData.copyright || ''}
                    onChange={(e) => setTempData({ ...tempData, copyright: e.target.value })}
                    className="w-full bg-spotify-gray text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bottom Links</label>
                  <div className="space-y-2">
                    {tempData.bottomLinks?.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={link.text || ''}
                          placeholder="Link text"
                          onChange={(e) => {
                            const newLinks = [...tempData.bottomLinks];
                            newLinks[index] = { ...link, text: e.target.value };
                            setTempData({ ...tempData, bottomLinks: newLinks });
                          }}
                          className="flex-1 bg-spotify-gray text-white px-3 py-2 rounded-lg"
                        />
                        <input
                          type="text"
                          value={link.url || ''}
                          placeholder="URL"
                          onChange={(e) => {
                            const newLinks = [...tempData.bottomLinks];
                            newLinks[index] = { ...link, url: e.target.value };
                            setTempData({ ...tempData, bottomLinks: newLinks });
                          }}
                          className="flex-1 bg-spotify-gray text-white px-3 py-2 rounded-lg"
                        />
                        <button
                          onClick={() => {
                            const newLinks = tempData.bottomLinks.filter((_, i) => i !== index);
                            setTempData({ ...tempData, bottomLinks: newLinks });
                          }}
                          className="p-2 hover:bg-red-600/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newLinks = [...(tempData.bottomLinks || []), { text: '', url: '' }];
                        setTempData({ ...tempData, bottomLinks: newLinks });
                      }}
                      className="text-sm text-primary hover:text-primary-hover"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveChanges}
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
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Copyright:</p>
                  <p className="text-white">{footerSection.copyright || 'Not set'}</p>
                </div>
                {footerSection.bottomLinks && footerSection.bottomLinks.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Bottom Links:</p>
                    <div className="flex gap-4 flex-wrap">
                      {footerSection.bottomLinks.map((link, index) => (
                        <span key={index} className="text-white text-sm">{link.text}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => startEditing('bottom')}
                  className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit Copyright & Links
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterManagement;