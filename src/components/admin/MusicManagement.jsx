import { useState } from 'react';
import { Music, Plus, Edit2, Trash2, Play, Pause, Upload, X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

const MusicManagement = () => {
  const { tracks, currentTrack, isPlaying, addTrack, updateTrack, deleteTrack, playTrack, pauseTrack } = useMusic();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    coverUrl: '',
    audioUrl: '',
    duration: '',
    lyrics: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      coverUrl: '',
      audioUrl: '',
      duration: '',
      lyrics: ''
    });
    setEditingTrack(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.artist || !formData.audioUrl) {
      setError('Title, Artist, and Audio URL are required');
      return;
    }

    try {
      let result;
      if (editingTrack) {
        result = await updateTrack(editingTrack.id, formData);
      } else {
        result = await addTrack(formData);
      }

      if (result) {
        setSuccess(editingTrack ? 'Track updated successfully!' : 'Track added successfully!');
        resetForm();
        setShowAddForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save track. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleEdit = (track) => {
    setEditingTrack(track);
    setFormData({
      title: track.title,
      artist: track.artist,
      album: track.album || '',
      coverUrl: track.coverUrl || '',
      audioUrl: track.audioUrl,
      duration: track.duration || '',
      lyrics: track.lyrics || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (trackId) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      const result = await deleteTrack(trackId);
      if (result) {
        setSuccess('Track deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete track');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '--:--';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Music Management</h1>
          <p className="text-gray-400">Manage tracks for the music player</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 bg-spotify-green hover:bg-spotify-green-hover text-black font-bold px-4 py-2 rounded-full transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Track
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400">
          {success}
        </div>
      )}
      {error && !showAddForm && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Inline Add/Edit Form */}
      {showAddForm && (
        <div className="bg-spotify-light-gray rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingTrack ? 'Edit Track' : 'Add New Track'}
            </h2>
            <button
              onClick={handleCancelForm}
              className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Error in form */}
          {error && (
            <div className="mb-4 p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Track Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                  placeholder="Enter track title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Artist *
                </label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                  placeholder="Enter artist name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Album
              </label>
              <input
                type="text"
                value={formData.album}
                onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                placeholder="Enter album name (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Audio URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="w-full bg-spotify-gray text-white pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                  placeholder="https://example.com/track.mp3"
                  required
                />
                <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Cover Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  className="w-full bg-spotify-gray text-white pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                  placeholder="https://example.com/cover.jpg"
                />
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration (in seconds)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                placeholder="e.g., 180 for 3:00"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Lyrics (Optional)
              </label>
              <textarea
                value={formData.lyrics}
                onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none resize-vertical"
                placeholder="Enter song lyrics..."
                rows="6"
              />
            </div>

            {/* Preview */}
            {(formData.coverUrl || formData.title) && (
              <div className="bg-spotify-gray rounded-lg p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                  {formData.coverUrl ? (
                    <img 
                      src={formData.coverUrl} 
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{formData.title || 'Track Title'}</h4>
                  <p className="text-gray-400 text-sm">
                    {formData.artist || 'Artist'} {formData.album && `• ${formData.album}`}
                  </p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-spotify-green hover:bg-spotify-green-hover text-black font-bold py-3 rounded-full transition-colors"
              >
                {editingTrack ? 'Update Track' : 'Add Track'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="flex-1 bg-spotify-gray hover:bg-spotify-card-hover text-white font-bold py-3 rounded-full transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tracks List */}
      <div className="bg-spotify-light-gray rounded-xl p-6">
        {tracks.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No tracks added yet</p>
            <p className="text-gray-500 mt-2">Click "Add Track" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`bg-spotify-gray rounded-lg p-4 flex items-center gap-4 hover:bg-spotify-card-hover transition-colors ${
                  currentTrack?.id === track.id ? 'ring-2 ring-spotify-green' : ''
                }`}
              >
                {/* Cover Image */}
                <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                  {track.coverUrl ? (
                    <img 
                      src={track.coverUrl} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{track.title}</h3>
                  <p className="text-gray-400 text-sm truncate">
                    {track.artist} {track.album && `• ${track.album}`}
                  </p>
                </div>

                {/* Duration */}
                <div className="text-gray-400 text-sm">
                  {formatDuration(track.duration)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <button
                      onClick={() => pauseTrack()}
                      className="p-2 bg-spotify-green text-black rounded-full hover:bg-spotify-green-hover transition-colors"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => playTrack(track)}
                      className="p-2 bg-spotify-gray hover:bg-spotify-card-hover text-white rounded-full transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleEdit(track)}
                    className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="p-2 hover:bg-red-600/20 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicManagement;