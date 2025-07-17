import { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import { useEnhancedProducts } from '../../context/EnhancedProductsContext';
import { 
  Package, ShoppingBag, Users, TrendingUp, 
  Eye, CheckCircle, XCircle, Clock, 
  BarChart3, PieChart, Activity, Play,
  MoreHorizontal, Download, Filter
} from 'lucide-react';

const Dashboard = () => {
  const { shopifyProducts, firebaseProducts, loading: productsLoading } = useEnhancedProducts();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShopifyProducts: 0,
    totalWholesaleProducts: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    verifiedUsers: 0
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(realtimeDb, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray = Object.keys(usersData).map(key => ({
            id: key,
            ...usersData[key]
          }));
          setUsers(usersArray);
          
          // Calculate user stats
          const activeUsers = usersArray.filter(user => user.status === 'active').length;
          const verifiedUsers = usersArray.filter(user => user.emailVerified).length;
          
          setStats(prev => ({
            ...prev,
            totalUsers: usersArray.length,
            activeUsers,
            inactiveUsers: usersArray.length - activeUsers,
            verifiedUsers
          }));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Update product stats when products change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalShopifyProducts: shopifyProducts.length,
      totalWholesaleProducts: firebaseProducts.length
    }));
    setLoading(productsLoading);
  }, [shopifyProducts, firebaseProducts, productsLoading]);

  // Spotify-style card component
  const SpotifyCard = ({ title, value, subtitle, icon: Icon, color = '#1db954', trend }) => {
    return (
      <div className="bg-[#181818] rounded-lg p-6 hover:bg-[#282828] transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-[#b3b3b3] font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            {subtitle && (
              <p className="text-sm text-[#b3b3b3] mt-1">{subtitle}</p>
            )}
          </div>
          <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
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

  // Spotify-style section header
  const SectionHeader = ({ title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-[#b3b3b3] mt-1">{subtitle}</p>}
      </div>
      {action && (
        <button className="text-sm text-[#b3b3b3] hover:text-white transition-colors flex items-center gap-2">
          {action}
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  // Spotify-style list item
  const ListItem = ({ rank, title, subtitle, value, image }) => (
    <div className="flex items-center p-4 rounded-md hover:bg-[#282828] transition-colors group">
      <span className="text-[#b3b3b3] font-medium mr-4 w-6">{rank}</span>
      {image && (
        <div className="w-10 h-10 bg-[#282828] rounded mr-4 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-white font-medium group-hover:underline">{title}</p>
        {subtitle && <p className="text-sm text-[#b3b3b3]">{subtitle}</p>}
      </div>
      <span className="text-[#b3b3b3] text-sm">{value}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-spotify-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}</h1>
        <p className="text-[#b3b3b3]">Here's what's happening with your store today</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SpotifyCard
          title="Total Products"
          value={stats.totalShopifyProducts + stats.totalWholesaleProducts}
          subtitle="All products"
          icon={Package}
          color="#3b82f6"
          trend={12}
        />
        <SpotifyCard
          title="Shopify Products"
          value={stats.totalShopifyProducts}
          subtitle="Retail items"
          icon={ShoppingBag}
          color="#8b5cf6"
          trend={8}
        />
        <SpotifyCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Registered accounts"
          icon={Users}
          color="#ec4899"
          trend={15}
        />
        <SpotifyCard
          title="Active Users"
          value={stats.activeUsers}
          subtitle="Currently active"
          icon={Activity}
          color="#1db954"
          trend={5}
        />
      </div>

      {/* Made for You Section */}
      <section className="mb-12">
        <SectionHeader 
          title="Made for you" 
          subtitle="Your personalized admin insights"
          action="Show all"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Daily Mix Cards */}
          <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-white mb-2">Products Mix</h3>
            <p className="text-sm text-purple-200 mb-4">Shopify, Wholesale, Featured</p>
            <div className="flex justify-end">
              <button className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-white mb-2">Users Mix</h3>
            <p className="text-sm text-green-200 mb-4">Active, Verified, New</p>
            <div className="flex justify-end">
              <button className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-700 to-orange-900 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-white mb-2">Analytics Mix</h3>
            <p className="text-sm text-orange-200 mb-4">Sales, Traffic, Conversions</p>
            <div className="flex justify-end">
              <button className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-12">
        <SectionHeader 
          title="Recent activity" 
          subtitle="Latest updates from your store"
          action="View all"
        />
        <div className="bg-[#181818] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#282828] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-sm bg-[#282828] text-white px-4 py-1.5 rounded-full hover:bg-[#3e3e3e] transition-colors">
                All
              </button>
              <button className="text-sm text-[#b3b3b3] px-4 py-1.5 hover:text-white transition-colors">
                Products
              </button>
              <button className="text-sm text-[#b3b3b3] px-4 py-1.5 hover:text-white transition-colors">
                Users
              </button>
              <button className="text-sm text-[#b3b3b3] px-4 py-1.5 hover:text-white transition-colors">
                Orders
              </button>
            </div>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="divide-y divide-[#282828]">
            <ListItem
              rank="1"
              title="New user registration"
              subtitle="2 minutes ago"
              value="john@example.com"
            />
            <ListItem
              rank="2"
              title="Product added"
              subtitle="15 minutes ago"
              value="Premium Package"
            />
            <ListItem
              rank="3"
              title="Order completed"
              subtitle="1 hour ago"
              value="$299.00"
            />
            <ListItem
              rank="4"
              title="User verified"
              subtitle="2 hours ago"
              value="sarah@example.com"
            />
            <ListItem
              rank="5"
              title="Wholesale inquiry"
              subtitle="3 hours ago"
              value="Bulk order request"
            />
          </div>
        </div>
      </section>

      {/* User Status Overview */}
      <section>
        <SectionHeader 
          title="User insights" 
          subtitle="Understanding your customer base"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Users Chart */}
          <div className="bg-[#181818] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-spotify-green" />
              Active Users
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#b3b3b3]">Daily Active</span>
                <span className="text-white font-medium">{Math.floor(stats.activeUsers * 0.4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#b3b3b3]">Weekly Active</span>
                <span className="text-white font-medium">{Math.floor(stats.activeUsers * 0.7)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#b3b3b3]">Monthly Active</span>
                <span className="text-white font-medium">{stats.activeUsers}</span>
              </div>
            </div>
          </div>

          {/* Verified Users */}
          <div className="bg-[#181818] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              Verified Users
            </h3>
            <div className="relative h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.verifiedUsers}</div>
                  <div className="text-sm text-[#b3b3b3] mt-1">
                    {Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% verified
                  </div>
                </div>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#282828"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#1db954"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(stats.verifiedUsers / stats.totalUsers) * 352} 352`}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-[#181818] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Recent Users
            </h3>
            <div className="space-y-3">
              {users.slice(0, 4).map((user, index) => (
                <div key={user.id || index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {user.displayName || user.email || `User ${index + 1}`}
                    </p>
                    <p className="text-xs text-[#b3b3b3]">
                      {user.status || 'active'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;