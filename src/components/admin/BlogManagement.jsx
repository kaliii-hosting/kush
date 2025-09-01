import { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, EyeOff, Upload, X, AlertCircle, Calendar, Clock } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

const BlogManagement = () => {
  const { posts, addPost, updatePost, deletePost, togglePostVisibility } = useBlog();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: '',
    tags: '',
    author: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      category: '',
      tags: '',
      author: ''
    });
    setEditingPost(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.content || !formData.author) {
      setError('Title, Content, and Author are required');
      return;
    }

    try {
      const postData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      let result;
      if (editingPost) {
        result = await updatePost(editingPost.id, postData);
      } else {
        result = await addPost(postData);
      }

      if (result) {
        setSuccess(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
        setTimeout(() => {
          setShowForm(false);
          resetForm();
          setSuccess('');
        }, 1500);
      } else {
        setError('Failed to save post. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      imageUrl: post.imageUrl || '',
      category: post.category || '',
      tags: post.tags ? post.tags.join(', ') : '',
      author: post.author || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(postId);
      if (result) {
        setSuccess('Post deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete post');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleToggleVisibility = async (postId) => {
    const result = await togglePostVisibility(postId);
    if (!result) {
      setError('Failed to update post visibility');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Blog Management</h1>
          <p className="text-gray-400">Create and manage blog posts</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-spotify-green hover:bg-spotify-green-hover text-black font-bold px-4 py-2 rounded-full transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Post
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && !showForm && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400">
          {success}
        </div>
      )}
      {error && !showForm && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Inline Form */}
      {showForm && (
        <div className="bg-spotify-light-gray rounded-2xl shadow-xl mb-8 p-6">
          {/* Form Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Error/Success in form */}
          {error && (
            <div className="mb-4 p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                  placeholder="Author name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                  placeholder="e.g., News, Education, Product"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none resize-none"
                placeholder="Brief summary of the post (optional)"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none resize-none"
                placeholder="Write your post content..."
                rows="8"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Featured Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-spotify-gray text-white pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-spotify-green outline-none"
                placeholder="Separate tags with commas (e.g., cannabis, health, lifestyle)"
              />
            </div>

            {/* Preview */}
            {(formData.imageUrl || formData.title) && (
              <div className="bg-spotify-gray rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Preview</h4>
                <div className="flex gap-4">
                  {formData.imageUrl && (
                    <div className="w-32 h-20 bg-black rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="text-white font-semibold mb-1">{formData.title || 'Post Title'}</h5>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {formData.excerpt || formData.content || 'Post excerpt or content preview...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-spotify-green hover:bg-spotify-green-hover text-black font-bold py-3 rounded-full transition-colors"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 bg-spotify-gray hover:bg-spotify-card-hover text-white font-bold py-3 rounded-full transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Grid */}
      <div className="bg-spotify-light-gray rounded-xl p-6">
        {posts.length === 0 && !showForm ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No blog posts yet</p>
            <p className="text-gray-500 mt-2">Click "New Post" to create your first article</p>
          </div>
        ) : (!showForm || posts.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-spotify-gray rounded-lg overflow-hidden hover:bg-spotify-card-hover transition-colors"
              >
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="aspect-video bg-black overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  {/* Post Info */}
                  <div className="mb-3">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt || post.content}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views || 0} views
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="mb-4">
                    {post.category && (
                      <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mr-2 mb-1">
                        {post.category}
                      </span>
                    )}
                    {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-block bg-spotify-card-hover text-gray-400 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVisibility(post.id)}
                        className={`p-2 rounded-full transition-colors ${
                          post.published 
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                            : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                        }`}
                        title={post.published ? 'Published' : 'Draft'}
                      >
                        {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 hover:bg-spotify-card-hover rounded-full transition-colors"
                      >
                        <Edit2 className="h-4 w-4 text-gray-400" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 hover:bg-red-600/20 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BlogManagement;