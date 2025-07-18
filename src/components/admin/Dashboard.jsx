import { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import { useEnhancedProducts } from '../../context/EnhancedProductsContext';
import { useBlog } from '../../context/BlogContext';
import { 
  Package, ShoppingBag, Users, TrendingUp, 
  Eye, CheckCircle, XCircle, Clock, 
  BarChart3, PieChart, Activity, Play,
  MoreHorizontal, Download, Filter,
  Music, FileText, Database, Receipt, RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { shopifyProducts = [], firebaseProducts = [], loading: productsLoading } = useEnhancedProducts();
  const { posts: blogPosts = [] } = useBlog();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cardRefreshing, setCardRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [realtimeActive, setRealtimeActive] = useState(false);
  const [stats, setStats] = useState({
    totalShopifyProducts: 0,
    totalWholesaleProducts: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    onlineNow: 0,
    totalMusicTracks: 0,
    totalInvoices: 0,
    totalBlogPosts: 0,
    storageSize: 0
  });
  
  // Debug logging
  useEffect(() => {
    console.log('Dashboard mounted');
    console.log('Shopify products:', shopifyProducts);
    console.log('Firebase products:', firebaseProducts);
    console.log('Blog posts:', blogPosts);
    console.log('Products loading:', productsLoading);
  }, [shopifyProducts, firebaseProducts, blogPosts, productsLoading]);

  // Fetch all stats data - wrapped to fix closure issue
  const fetchAllStats = async (isRefreshing = false) => {
    console.log('Starting to fetch dashboard stats...');
    if (!isRefreshing) setLoading(true);
    try {
        // Initialize counts
        let totalUsers = 0;
        let activeUsers = 0;
        let musicTracks = 0;
        let invoices = 0;
        
        // Fetch users data
        try {
          console.log('Fetching users...');
          const usersRef = ref(realtimeDb, 'users');
          const usersSnapshot = await get(usersRef);
          
          if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
            const usersArray = Object.keys(usersData).map(key => ({
              id: key,
              ...usersData[key]
            }));
            totalUsers = usersArray.length;
            activeUsers = usersArray.filter(user => user.status === 'active').length;
            console.log(`Found ${totalUsers} users (${activeUsers} active)`);
          } else {
            console.log('No users found in database');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
        
        // Fetch music tracks count
        try {
          console.log('Fetching music tracks...');
          const musicRef = ref(realtimeDb, 'musicTracks');
          const musicSnapshot = await get(musicRef);
          
          if (musicSnapshot.exists()) {
            musicTracks = Object.keys(musicSnapshot.val()).length;
            console.log(`Found ${musicTracks} music tracks`);
          } else {
            console.log('No music tracks found');
          }
        } catch (error) {
          console.error('Error fetching music tracks:', error);
        }

        // Fetch invoices count
        try {
          console.log('Fetching invoices...');
          const invoicesRef = ref(realtimeDb, 'wholesale_invoices');
          const invoicesSnapshot = await get(invoicesRef);
          
          if (invoicesSnapshot.exists()) {
            invoices = Object.keys(invoicesSnapshot.val()).length;
            console.log(`Found ${invoices} invoices`);
          } else {
            console.log('No invoices found');
          }
        } catch (error) {
          console.error('Error fetching invoices:', error);
        }

        // Use blog posts from context (already fetched)
        console.log('Using blog posts from context...');
        const blogPostsCount = blogPosts?.length || 0;
        console.log(`Found ${blogPostsCount} blog posts from context`);

        // Fetch storage size from Supabase
        let storageSize = 0;
        try {
          console.log('Fetching storage size...');
          
          // Import from supabase config
          const { supabase, STORAGE_BUCKET } = await import('../../config/supabase');
          
          console.log('Using storage bucket:', STORAGE_BUCKET);
          
          // Function to recursively get all files
          const calculateTotalSize = async (path = '') => {
            let totalSize = 0;
            
            const { data: items, error } = await supabase.storage
              .from(STORAGE_BUCKET)
              .list(path, {
                limit: 1000,
                offset: 0
              });
            
            if (error) {
              console.error(`Error listing files in ${path}:`, error);
              return 0;
            }
            
            if (!items || items.length === 0) {
              return 0;
            }
            
            console.log(`Found ${items.length} items in path: ${path || '/'}`);
            
            for (const item of items) {
              // Files have an id property, folders don't
              if (item.id !== null && item.id !== undefined) {
                // It's a file
                const size = item.metadata?.size || 0;
                totalSize += size;
                console.log(`File: ${item.name}, Size: ${size} bytes`);
              } else {
                // It's a folder, recurse into it
                console.log(`Folder: ${item.name}`);
                const folderPath = path ? `${path}/${item.name}` : item.name;
                const folderSize = await calculateTotalSize(folderPath);
                totalSize += folderSize;
              }
            }
            
            return totalSize;
          };
          
          // Calculate total storage size
          storageSize = await calculateTotalSize();
          console.log(`\nTotal storage size: ${storageSize} bytes (${(storageSize / 1024 / 1024).toFixed(2)} MB)`);
          
        } catch (error) {
          console.error('Error calculating storage size:', error);
        }

        // Log product counts
        console.log(`Shopify products: ${shopifyProducts ? shopifyProducts.length : 0}`);
        console.log(`Wholesale products: ${firebaseProducts ? firebaseProducts.length : 0}`);

        // Update all stats
        const newStats = {
          totalShopifyProducts: shopifyProducts ? shopifyProducts.length : 0,
          totalWholesaleProducts: firebaseProducts ? firebaseProducts.length : 0,
          totalUsers: totalUsers,
          activeUsers: activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          totalMusicTracks: musicTracks,
          totalInvoices: invoices,
          totalBlogPosts: blogPostsCount,
          storageSize: storageSize
        };
        
        console.log('Setting stats:', newStats);
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
        if (isRefreshing) {
          setRefreshing(false);
        }
      }
    };
    
    // Manual refresh function
    const handleRefresh = async () => {
      console.log('Manual refresh triggered');
      setRefreshing(true);
      setCardRefreshing(true);
      
      // Add a small delay to show the animation
      setTimeout(async () => {
        await fetchAllStats(true);
        setTimeout(() => {
          setCardRefreshing(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }, 300);
      }, 100);
    };

    // Initial fetch
    useEffect(() => {
      fetchAllStats();
  }, [shopifyProducts, firebaseProducts, blogPosts]);
  
  // Add real-time listeners for dynamic updates
  useEffect(() => {
    console.log('Setting up real-time listeners...');
    
    // Listen for users changes
    const usersRef = ref(realtimeDb, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      console.log('Users data updated - Real-time event triggered');
      setRealtimeActive(true);
      setTimeout(() => setRealtimeActive(false), 1000);
      
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.keys(usersData).map(key => ({
          id: key,
          ...usersData[key]
        }));
        
        const totalUsers = usersArray.length;
        
        // Count active users based on multiple criteria
        let activeUsers = 0;
        const now = Date.now();
        const ACTIVE_THRESHOLD = 30 * 24 * 60 * 60 * 1000; // 30 days
        
        usersArray.forEach(user => {
          // Check multiple fields for activity status
          const isActive = 
            user.status === 'active' ||
            user.isActive === true ||
            (user.lastActive && (now - user.lastActive) < ACTIVE_THRESHOLD) ||
            (user.lastLogin && (now - user.lastLogin) < ACTIVE_THRESHOLD) ||
            (user.createdAt && (now - user.createdAt) < ACTIVE_THRESHOLD && !user.status);
          
          if (isActive) {
            activeUsers++;
          }
          
          // Log user details for debugging
          console.log(`User ${user.id}:`, {
            status: user.status,
            isActive: user.isActive,
            lastActive: user.lastActive,
            lastLogin: user.lastLogin,
            computed: isActive ? 'ACTIVE' : 'INACTIVE'
          });
        });
        
        console.log(`Users - Total: ${totalUsers}, Active: ${activeUsers}`);
        
        setStats(prev => ({
          ...prev,
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers
        }));
      } else {
        console.log('No users found');
        setStats(prev => ({
          ...prev,
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0
        }));
      }
    });
    
    // Also listen for presence data if it exists
    const presenceRef = ref(realtimeDb, 'presence');
    const unsubscribePresence = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log('Presence data updated');
        const presenceData = snapshot.val();
        let onlineNow = 0;
        
        Object.keys(presenceData).forEach(userId => {
          if (presenceData[userId]?.online === true) {
            onlineNow++;
          }
        });
        
        console.log(`Users online now: ${onlineNow}`);
        
        // Update subtitle to show online status
        setStats(prev => ({
          ...prev,
          onlineNow // Store separately for subtitle
        }));
      }
    });
    
    // Listen for music tracks changes
    const musicRef = ref(realtimeDb, 'musicTracks');
    const unsubscribeMusic = onValue(musicRef, (snapshot) => {
      if (snapshot.exists()) {
        const musicTracks = Object.keys(snapshot.val()).length;
        setStats(prev => ({ ...prev, totalMusicTracks: musicTracks }));
      }
    });
    
    // Listen for invoices changes
    const invoicesRef = ref(realtimeDb, 'wholesale_invoices');
    const unsubscribeInvoices = onValue(invoicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const invoices = Object.keys(snapshot.val()).length;
        setStats(prev => ({ ...prev, totalInvoices: invoices }));
      }
    });
    
    return () => {
      unsubscribeUsers();
      unsubscribePresence();
      unsubscribeMusic();
      unsubscribeInvoices();
    };
  }, []);
  
  // Update blog posts count when context changes
  useEffect(() => {
    setStats(prev => ({ ...prev, totalBlogPosts: blogPosts?.length || 0 }));
  }, [blogPosts]);

  // Format storage size
  const formatStorageSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Spotify-style card component
  const SpotifyCard = ({ title, value, subtitle, icon: Icon, color = '#1db954', trend }) => {
    return (
      <div className={`bg-[#181818] rounded-lg p-6 hover:bg-[#282828] transition-all duration-300 cursor-pointer group relative overflow-hidden ${
        cardRefreshing ? 'animate-pulse' : ''
      }`}>
        {/* Refresh animation overlay */}
        {cardRefreshing && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-[#b3b3b3] font-medium">{title}</p>
            <h3 className={`text-3xl font-bold text-white mt-1 transition-all duration-300 ${
              cardRefreshing ? 'opacity-50' : 'opacity-100'
            }`}>{value}</h3>
            {subtitle && (
              <p className="text-sm text-[#b3b3b3] mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2 rounded-full transition-all duration-300 ${
            cardRefreshing ? 'animate-spin' : ''
          }`} style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
            {title === 'Total Users' && realtimeActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-spotify-green' : 'text-red-500 rotate-180'}`} />
            <span className={`text-sm font-medium ${trend > 0 ? 'text-spotify-green' : 'text-red-500'}`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-[#b3b3b3]">vs last month</span>
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

  return (
    <div>
      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100%); opacity: 0; }
        }
        .toast-enter {
          animation: slideIn 0.3s ease-out;
        }
        .toast-exit {
          animation: slideOut 0.3s ease-out;
        }
      `}</style>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 toast-enter">
          <div className="bg-spotify-green text-black px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Dashboard refreshed successfully!</span>
          </div>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}</h1>
          <p className="text-[#b3b3b3]">Here's what's happening with your store today</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-[#282828] hover:bg-[#3e3e3e] text-white rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <SpotifyCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={
            stats.onlineNow > 0 
              ? `${stats.onlineNow} online now, ${stats.activeUsers} active` 
              : `${stats.activeUsers} active, ${stats.inactiveUsers} inactive`
          }
          icon={Users}
          color="#1db954"
        />
        <SpotifyCard
          title="Storage Used"
          value={formatStorageSize(stats.storageSize)}
          subtitle="Total files in Supabase"
          icon={Database}
          color="#3b82f6"
        />
        <SpotifyCard
          title="Shopify Products"
          value={stats.totalShopifyProducts}
          subtitle="Shop catalog"
          icon={ShoppingBag}
          color="#9333ea"
        />
        <SpotifyCard
          title="Wholesale Products"
          value={stats.totalWholesaleProducts}
          subtitle="Wholesale catalog"
          icon={Package}
          color="#ec4899"
        />
        <SpotifyCard
          title="Music Tracks"
          value={stats.totalMusicTracks}
          subtitle="In music player"
          icon={Music}
          color="#f59e0b"
        />
        <SpotifyCard
          title="Invoices"
          value={stats.totalInvoices}
          subtitle="Generated invoices"
          icon={Receipt}
          color="#06b6d4"
        />
        <SpotifyCard
          title="Blog Posts"
          value={stats.totalBlogPosts}
          subtitle="Published articles"
          icon={FileText}
          color="#10b981"
        />
      </div>
    </div>
  );
};

export default Dashboard;