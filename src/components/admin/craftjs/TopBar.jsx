import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Save, Undo, Redo, Eye, EyeOff, ArrowLeft, RotateCcw, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pageTemplates } from './pageTemplates';

export const TopBar = ({ onSave, selectedPage, pages, onPageChange }) => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);
  
  const { actions, query, enabled, canUndo, canRedo } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo()
  }));

  const handleResetToTemplate = () => {
    const confirmReset = window.confirm(`This will reset the ${pages?.find(p => p.id === selectedPage)?.name} page to its default template. All current changes will be lost. Continue?`);
    if (confirmReset) {
      const template = pageTemplates[selectedPage];
      if (template) {
        console.log('Resetting to template:', template);
        actions.clearEvents();
        actions.deserialize(JSON.stringify(template));
      }
    }
  };

  const handleDuplicatePage = () => {
    const currentData = query.serialize();
    const pageName = prompt('Enter name for the new page:');
    if (pageName) {
      // This would need backend implementation to create a new page
      alert('Page duplication feature coming soon!');
    }
  };

  const handleSave = () => {
    const json = query.serialize();
    onSave(json);
  };

  const togglePreview = () => {
    setPreview(!preview);
    actions.setOptions(options => options.enabled = preview);
  };

  return (
    <div className="bg-gray-darker border-b border-gray-dark px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-lighter hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Admin
          </button>
          
          <h2 className="text-white font-semibold text-lg">Website Builder</h2>
          
          <div className="flex items-center gap-2 ml-8">
            <label className="text-gray-lighter text-sm">Page:</label>
            <select
              value={selectedPage}
              onChange={(e) => onPageChange(e.target.value)}
              className="bg-gray-dark text-white px-3 py-1 rounded border border-gray-light focus:border-primary outline-none"
            >
              {pages?.map(page => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => actions.history.undo()}
            disabled={!canUndo}
            className={`p-2 rounded ${
              canUndo 
                ? 'bg-gray-dark hover:bg-gray-light text-white' 
                : 'bg-gray-dark text-gray-lighter cursor-not-allowed'
            } transition-colors`}
            title="Undo"
          >
            <Undo className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => actions.history.redo()}
            disabled={!canRedo}
            className={`p-2 rounded ${
              canRedo 
                ? 'bg-gray-dark hover:bg-gray-light text-white' 
                : 'bg-gray-dark text-gray-lighter cursor-not-allowed'
            } transition-colors`}
            title="Redo"
          >
            <Redo className="h-5 w-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-dark mx-2" />
          
          <button
            onClick={handleResetToTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-gray-dark hover:bg-gray-light text-white rounded transition-colors"
            title="Reset page to default template"
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </button>
          
          <button
            onClick={togglePreview}
            className="flex items-center gap-2 px-4 py-2 bg-gray-dark hover:bg-gray-light text-white rounded transition-colors"
          >
            {preview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};