import React from 'react';
import { useNode } from '@craftjs/core';

export const VideoSection = ({ videoUrl, title, subtitle, alignment, autoplay, muted, loop }) => {
  const { connectors: { connect, drag } } = useNode();
  
  const alignments = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="relative min-h-[400px] overflow-hidden bg-black"
    >
      {videoUrl && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline
        />
      )}
      
      <div className="relative z-10 h-full min-h-[400px] flex items-center justify-center bg-black/50">
        <div className={`max-w-4xl mx-auto px-6 flex flex-col gap-4 ${alignments[alignment || 'center']}`}>
          {title && (
            <h2 className="text-4xl font-bold text-white">{title}</h2>
          )}
          {subtitle && (
            <p className="text-xl text-gray-lighter">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoSectionSettings = () => {
  const { actions: { setProp }, videoUrl, title, subtitle, alignment, autoplay, muted, loop } = useNode((node) => ({
    videoUrl: node.data.props.videoUrl,
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    alignment: node.data.props.alignment,
    autoplay: node.data.props.autoplay,
    muted: node.data.props.muted,
    loop: node.data.props.loop
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Video URL</label>
        <input
          type="text"
          value={videoUrl || ''}
          onChange={(e) => setProp((props) => props.videoUrl = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
          placeholder="https://example.com/video.mp4"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Title</label>
        <input
          type="text"
          value={title || ''}
          onChange={(e) => setProp((props) => props.title = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Subtitle</label>
        <input
          type="text"
          value={subtitle || ''}
          onChange={(e) => setProp((props) => props.subtitle = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-lighter mb-2">Alignment</label>
        <select
          value={alignment || 'center'}
          onChange={(e) => setProp((props) => props.alignment = e.target.value)}
          className="w-full px-3 py-2 bg-gray-dark text-white rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoplay || false}
            onChange={(e) => setProp((props) => props.autoplay = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-lighter">Autoplay</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={muted || false}
            onChange={(e) => setProp((props) => props.muted = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-lighter">Muted</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={loop || false}
            onChange={(e) => setProp((props) => props.loop = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-lighter">Loop</span>
        </label>
      </div>
    </div>
  );
};

VideoSection.craft = {
  displayName: 'Video Section',
  props: {
    videoUrl: '',
    title: '',
    subtitle: '',
    alignment: 'center',
    autoplay: true,
    muted: true,
    loop: true
  },
  related: {
    settings: VideoSectionSettings
  }
};