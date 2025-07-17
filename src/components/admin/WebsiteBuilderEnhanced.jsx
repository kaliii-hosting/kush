import { useState, useEffect } from 'react';
import { usePageContent } from '../../context/PageContentContext';
import { 
  Home, Info, ShoppingBag, Package2, Phone, 
  Globe, ChevronDown, ChevronUp, Save, X, 
  Edit3, Plus, Trash2, RefreshCw, Video, 
  Image, Type, ArrowUp, ArrowDown, Copy,
  Grid, Layout, FileText, Sparkles, Package, Columns, GripVertical
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Page configuration
const pages = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'about', name: 'About', icon: Info },
  { id: 'shop', name: 'Shop', icon: ShoppingBag },
  { id: 'wholesale', name: 'Wholesale', icon: Package2 },
  { id: 'contact', name: 'Contact', icon: Phone }
];

// Sortable Section Item Component
const SortableSection = ({ 
  section, 
  index, 
  sections, 
  expandedSections, 
  toggleSection, 
  startEditing, 
  editingSection, 
  handleDeleteSection, 
  renderSectionEditor, 
  renderSectionPreview 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-spotify-gray rounded-xl overflow-hidden">
      {/* Section Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex-1 flex items-center gap-3 text-left"
          >
            <div className="p-2 bg-primary/20 rounded-lg">
              {section.type === 'products' ? <Package className="w-4 h-4 text-primary" /> :
               section.type === 'footer' ? <Columns className="w-4 h-4 text-primary" /> :
               section.videoUrl ? <Video className="w-4 h-4 text-primary" /> :
               section.imageUrl ? <Image className="w-4 h-4 text-primary" /> :
               <Type className="w-4 h-4 text-primary" />}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">{section.name}</h3>
              <p className="text-sm text-gray-400">Type: {section.type}</p>
            </div>
            {expandedSections.has(section.id) ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>

          {/* Section Actions */}
          <div className="flex items-center gap-2 ml-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="p-2 hover:bg-spotify-light-gray rounded transition-colors cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {section.editable !== false && (
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="p-2 hover:bg-red-600/20 rounded transition-colors"
                title="Delete Section"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section Content */}
      {expandedSections.has(section.id) && (
        <div className="p-4 border-t border-spotify-light-gray">
          {editingSection === section.id ? (
            renderSectionEditor()
          ) : (
            <>
              {renderSectionPreview(section)}
              {section.editable !== false && (
                <button
                  onClick={() => startEditing(section.id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Section
                </button>
              )}
              {section.editable === false && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  This section cannot be edited
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const WebsiteBuilderEnhanced = () => {
  const { 
    pageContent, 
    loading, 
    saving, 
    updateSection, 
    addSection,
    deleteSection,
    reorderSections,
    resetToDefaults,
    sectionTemplates,
    defaultPageContent,
    updateEntirePage
  } = usePageContent();

  const [selectedPage, setSelectedPage] = useState('home');
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [editingSection, setEditingSection] = useState(null);
  const [tempContent, setTempContent] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Get current page data
  const currentPageData = pageContent[selectedPage] || { sections: [] };
  const sections = currentPageData.sections || [];

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      
      const success = await reorderSections(selectedPage, newSections);
      if (success) {
        setSuccessMessage('Sections reordered successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to reorder sections.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

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
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setTempContent({ ...section });
      setEditingSection(sectionId);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSection(null);
    setTempContent(null);
  };

  // Save section changes
  const saveSection = async () => {
    if (!editingSection || !tempContent) return;

    // Make sure we're not overwriting the ID
    const sectionToUpdate = {
      ...tempContent,
      id: editingSection // Ensure ID is preserved
    };
    
    const success = await updateSection(selectedPage, editingSection, sectionToUpdate);
    if (success) {
      setSuccessMessage('Section updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      cancelEditing();
    } else {
      setErrorMessage('Failed to update section. Please try again.');
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

  // Handle array field change
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

  // Add item to array
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


  // Delete section
  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    
    const success = await deleteSection(selectedPage, sectionId);
    if (success) {
      setSuccessMessage('Section deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage('Failed to delete section.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Add new section
  const handleAddSection = async () => {
    if (!selectedTemplate) return;
    
    const success = await addSection(selectedPage, selectedTemplate);
    if (success) {
      setSuccessMessage('Section added successfully!');
      setShowAddSection(false);
      setSelectedTemplate(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage('Failed to add section.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
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

    // Filter out system fields
    const editableFields = Object.entries(tempContent).filter(([field]) => 
      !['id', 'type', 'name', 'editable', 'productType'].includes(field) && 
      field !== 'items' && field !== 'columns' && field !== 'socialLinks' && 
      field !== 'newsletter' && field !== 'bottomLinks'
    );

    return (
      <div className="bg-spotify-gray rounded-xl p-6 space-y-4">
        {/* Section name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Section Name
          </label>
          <input
            type="text"
            value={tempContent.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full bg-black/30 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Regular fields */}
        {editableFields.map(([field, value]) => (
          <div key={field}>
            {renderFieldEditor(field, value)}
          </div>
        ))}

        {/* Footer columns */}
        {tempContent.type === 'footer' && tempContent.columns && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">Footer Columns</h4>
              <button
                onClick={() => {
                  const columns = [...(tempContent.columns || [])];
                  columns.push({
                    id: `column_${Date.now()}`,
                    title: 'New Column',
                    links: [{ text: 'Link', url: '#' }]
                  });
                  handleFieldChange('columns', columns);
                }}
                className="flex items-center gap-2 px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Column
              </button>
            </div>
            
            {tempContent.columns.map((column, colIndex) => (
              <div key={column.id} className="bg-black/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={column.title || ''}
                    onChange={(e) => {
                      const columns = [...tempContent.columns];
                      columns[colIndex] = { ...columns[colIndex], title: e.target.value };
                      handleFieldChange('columns', columns);
                    }}
                    className="bg-spotify-gray text-white px-3 py-1 rounded font-medium"
                    placeholder="Column Title"
                  />
                  <button
                    onClick={() => {
                      const columns = tempContent.columns.filter((_, i) => i !== colIndex);
                      handleFieldChange('columns', columns);
                    }}
                    className="p-1 hover:bg-red-600/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {column.links && column.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={link.text || ''}
                        placeholder="Link text"
                        onChange={(e) => {
                          const columns = [...tempContent.columns];
                          columns[colIndex].links[linkIndex] = { 
                            ...columns[colIndex].links[linkIndex], 
                            text: e.target.value 
                          };
                          handleFieldChange('columns', columns);
                        }}
                        className="flex-1 bg-spotify-gray text-white px-2 py-1 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={link.url || ''}
                        placeholder="URL"
                        onChange={(e) => {
                          const columns = [...tempContent.columns];
                          columns[colIndex].links[linkIndex] = { 
                            ...columns[colIndex].links[linkIndex], 
                            url: e.target.value 
                          };
                          handleFieldChange('columns', columns);
                        }}
                        className="flex-1 bg-spotify-gray text-white px-2 py-1 rounded text-sm"
                      />
                      <button
                        onClick={() => {
                          const columns = [...tempContent.columns];
                          columns[colIndex].links = columns[colIndex].links.filter((_, i) => i !== linkIndex);
                          handleFieldChange('columns', columns);
                        }}
                        className="p-1 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const columns = [...tempContent.columns];
                      if (!columns[colIndex].links) columns[colIndex].links = [];
                      columns[colIndex].links.push({ text: '', url: '' });
                      handleFieldChange('columns', columns);
                    }}
                    className="text-sm text-primary hover:text-primary-hover"
                  >
                    + Add Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Social Links for Footer */}
        {tempContent.type === 'footer' && tempContent.socialLinks && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">Social Links</h4>
              <button
                onClick={() => {
                  const socialLinks = [...(tempContent.socialLinks || [])];
                  socialLinks.push({ platform: '', url: '' });
                  handleFieldChange('socialLinks', socialLinks);
                }}
                className="flex items-center gap-2 px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Social Link
              </button>
            </div>
            
            {tempContent.socialLinks.map((social, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={social.platform || ''}
                  placeholder="Platform (e.g., instagram)"
                  onChange={(e) => {
                    const socialLinks = [...tempContent.socialLinks];
                    socialLinks[index] = { ...socialLinks[index], platform: e.target.value };
                    handleFieldChange('socialLinks', socialLinks);
                  }}
                  className="flex-1 bg-black/30 text-white px-3 py-2 rounded-lg"
                />
                <input
                  type="url"
                  value={social.url || ''}
                  placeholder="URL"
                  onChange={(e) => {
                    const socialLinks = [...tempContent.socialLinks];
                    socialLinks[index] = { ...socialLinks[index], url: e.target.value };
                    handleFieldChange('socialLinks', socialLinks);
                  }}
                  className="flex-1 bg-black/30 text-white px-3 py-2 rounded-lg"
                />
                <button
                  onClick={() => {
                    const socialLinks = tempContent.socialLinks.filter((_, i) => i !== index);
                    handleFieldChange('socialLinks', socialLinks);
                  }}
                  className="p-2 hover:bg-red-600/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter for Footer */}
        {tempContent.type === 'footer' && tempContent.newsletter && (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Newsletter Section</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={tempContent.newsletter.title || ''}
                placeholder="Newsletter Title"
                onChange={(e) => {
                  handleFieldChange('newsletter', {
                    ...tempContent.newsletter,
                    title: e.target.value
                  });
                }}
                className="w-full bg-black/30 text-white px-3 py-2 rounded-lg"
              />
              <textarea
                value={tempContent.newsletter.description || ''}
                placeholder="Newsletter Description"
                onChange={(e) => {
                  handleFieldChange('newsletter', {
                    ...tempContent.newsletter,
                    description: e.target.value
                  });
                }}
                className="w-full bg-black/30 text-white px-3 py-2 rounded-lg resize-none"
                rows="2"
              />
              <input
                type="text"
                value={tempContent.newsletter.placeholder || ''}
                placeholder="Email Input Placeholder"
                onChange={(e) => {
                  handleFieldChange('newsletter', {
                    ...tempContent.newsletter,
                    placeholder: e.target.value
                  });
                }}
                className="w-full bg-black/30 text-white px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                value={tempContent.newsletter.buttonText || ''}
                placeholder="Subscribe Button Text"
                onChange={(e) => {
                  handleFieldChange('newsletter', {
                    ...tempContent.newsletter,
                    buttonText: e.target.value
                  });
                }}
                className="w-full bg-black/30 text-white px-3 py-2 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Array items */}
        {tempContent.items && (
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
  const renderSectionPreview = (section) => {
    // Special handling for product sections
    if (section.type === 'products') {
      return (
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            This section displays dynamic product listings from your inventory.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Product Type: <span className="text-gray-300">{section.productType}</span>
          </p>
        </div>
      );
    }

    // Special handling for footer sections
    if (section.type === 'footer') {
      return (
        <div className="bg-black/30 rounded-lg p-4 space-y-4">
          {section.columns && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">Footer Columns:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.columns.map((column, index) => (
                  <div key={index} className="text-xs">
                    <p className="font-medium text-white mb-1">{column.title}</p>
                    {column.links && column.links.slice(0, 3).map((link, linkIndex) => (
                      <p key={linkIndex} className="text-gray-400">{link.text}</p>
                    ))}
                    {column.links && column.links.length > 3 && (
                      <p className="text-gray-500">+{column.links.length - 3} more</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {section.socialLinks && section.socialLinks.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-400">
                Social Links: {section.socialLinks.map(s => s.platform).join(', ')}
              </p>
            </div>
          )}
          {section.newsletter && (
            <div>
              <p className="text-sm font-medium text-gray-400">Newsletter: {section.newsletter.title}</p>
            </div>
          )}
          {section.copyright && (
            <p className="text-xs text-gray-500">{section.copyright}</p>
          )}
        </div>
      );
    }

    const editableFields = Object.entries(section).filter(([field]) => 
      !['id', 'type', 'name', 'editable', 'productType'].includes(field)
    );

    return (
      <div className="bg-black/30 rounded-lg p-4 space-y-2">
        {editableFields.map(([field, value]) => {
          if (field === 'items' && Array.isArray(value)) {
            return (
              <div key={field} className="space-y-2">
                <p className="text-sm font-medium text-gray-400">Items:</p>
                {value.map((item, index) => (
                  <div key={index} className="pl-4 text-sm">
                    <p className="text-gray-300">• {item.title || item.label || 'Untitled'}</p>
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

  // Render add section modal
  const renderAddSectionModal = () => {
    if (!showAddSection) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-spotify-light-gray rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-spotify-gray">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add New Section</h2>
              <button
                onClick={() => {
                  setShowAddSection(false);
                  setSelectedTemplate(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {Object.entries(sectionTemplates)
              .filter(([category]) => category !== 'footer')
              .map(([category, templates]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                  {category} Sections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(templates).map(([templateId, template]) => (
                    <button
                      key={templateId}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate?.name === template.name
                          ? 'border-primary bg-primary/10'
                          : 'border-spotify-gray hover:border-gray-600 bg-spotify-gray'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {category === 'hero' && <Layout className="w-5 h-5 text-primary" />}
                        {category === 'content' && <FileText className="w-5 h-5 text-primary" />}
                        {category === 'cta' && <Sparkles className="w-5 h-5 text-primary" />}
                        <h4 className="font-medium text-white">{template.name}</h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        {template.title || template.description || 'Custom section'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-spotify-gray">
            <div className="flex gap-3">
              <button
                onClick={handleAddSection}
                disabled={!selectedTemplate}
                className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add Section
              </button>
              <button
                onClick={() => {
                  setShowAddSection(false);
                  setSelectedTemplate(null);
                }}
                className="flex-1 bg-spotify-gray hover:bg-spotify-card-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
          <p className="text-gray-400">Manage and organize content across all pages</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddSection(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
          {selectedPage === 'home' && (
            <button
              onClick={async () => {
                if (window.confirm('This will restore all default homepage sections including product sections. Are you sure?')) {
                  try {
                    const defaultHome = defaultPageContent.home;
                    await updateEntirePage('home', defaultHome);
                    setSuccessMessage('Homepage reset to default with all product sections!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  } catch (error) {
                    setErrorMessage('Failed to reset homepage.');
                    setTimeout(() => setErrorMessage(''), 3000);
                  }
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Restore Product Sections
            </button>
          )}
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
              {pages.find(p => p.id === selectedPage)?.name} Page Sections
            </h2>

            {/* Sections */}
            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-12">
                  <Grid className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No sections yet. Add your first section to get started!</p>
                  <button
                    onClick={() => setShowAddSection(true)}
                    className="mt-4 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add First Section
                  </button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {sections.map((section, index) => (
                        <SortableSection
                          key={section.id}
                          section={section}
                          index={index}
                          sections={sections}
                          expandedSections={expandedSections}
                          toggleSection={toggleSection}
                          startEditing={startEditing}
                          editingSection={editingSection}
                          handleDeleteSection={handleDeleteSection}
                          renderSectionEditor={renderSectionEditor}
                          renderSectionPreview={renderSectionPreview}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {renderAddSectionModal()}
    </div>
  );
};

export default WebsiteBuilderEnhanced;