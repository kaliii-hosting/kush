import React from 'react';
import { useEditor } from '@craftjs/core';
import { X } from 'lucide-react';

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && 
                  state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      };
    }

    return { selected };
  });

  return (
    <div className="h-full">
      {selected ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">{selected.name} Settings</h3>
            {selected.isDeletable && (
              <button
                onClick={() => actions.delete(selected.id)}
                className="text-gray-lighter hover:text-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {selected.settings && (
            typeof selected.settings === 'function' 
              ? React.createElement(selected.settings)
              : selected.settings
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-lighter">
          <p>Select a component to edit its properties</p>
        </div>
      )}
    </div>
  );
};