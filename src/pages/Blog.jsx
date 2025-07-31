import { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import BlogModal from '../components/BlogModal';
import { Calendar, User, Clock, Search } from 'lucide-react';

const Blog = () => {
  const { posts, loading } = useBlog();
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (posts) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative" style={{ isolation: 'isolate' }}>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-b from-primary/20 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Blog & Updates
            </h1>
            <p className="text-spotify-text-subdued text-lg">
              Stay updated with the latest news, insights, and stories from Kushie
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center bg-spotify-light-gray rounded-full px-6 py-3">
            <Search className="h-5 w-5 text-spotify-text-subdued mr-3" />
            <input
              type="text"
              placeholder="Search blog posts..."
              className="bg-transparent text-white placeholder-spotify-text-subdued outline-none flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20 relative z-20">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-spotify-light-gray rounded-lg overflow-hidden cursor-pointer transition-all hover:bg-spotify-card-hover hover:scale-[1.02] relative z-30"
                style={{ pointerEvents: 'auto', position: 'relative' }}
              >
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-spotify-text-subdued mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Post Metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-spotify-text-subdued">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Read Now Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                      }}
                      className="bg-[#CB6015] hover:bg-[#E06A15] text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 z-40 relative"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Read Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-spotify-text-subdued text-lg">
              {searchQuery ? 'No posts found matching your search.' : 'No blog posts available yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      {selectedPost && (
        <BlogModal 
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default Blog;