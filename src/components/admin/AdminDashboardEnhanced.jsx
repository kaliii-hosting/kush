import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';
import { createClient } from '@supabase/supabase-js';
import { useEnhancedProducts } from '../../context/EnhancedProductsContext';
import { 
  LogOut, Package, Home, Settings, X,
  ShoppingBag, FileText, Users, MessageSquare, Music, Database,
  Bell, ChevronLeft, ChevronRight, Play, Library, Plus,
  Image, Columns, Key, Mail
} from 'lucide-react';
import ProductsPage from './ProductsPage';
import WholesaleManagement from './WholesaleManagement';
import MusicManagement from './MusicManagement';
import BlogManagement from './BlogManagement';
import UsersManagement from './UsersManagement';
import StorageManagement from './StorageManagement';
import Dashboard from './Dashboard';
import LogosManagement from './LogosManagement';
import FooterManagement from './FooterManagement';
import PasswordsManagement from './PasswordsManagement';
import MessagesPage from './MessagesPage';
import NotificationSystem from './NotificationSystem';
import { useLogos } from '../../context/LogosContext';
import './AdminDashboard.css';

const AdminDashboardEnhanced = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { logos } = useLogos();
  const { firebaseProducts } = useEnhancedProducts();
  
  // Stats state
  const [stats, setStats] = useState({
    users: 0,
    invoices: 0,
    music: 0,
    blog: 0,
    storage: '0 MB'
  });
  
  // Fetch stats for sidebar
  useEffect(() => {
    const fetchStats = async () => {
      let usersCount = 0;
      let invoicesCount = 0;
      let musicCount = 0;
      let blogCount = 0;
      
      // Fetch users count
      try {
        const usersRef = ref(realtimeDb, 'users');
        const usersSnapshot = await get(usersRef);
        usersCount = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      
      // Fetch invoices count
      try {
        const invoicesRef = ref(realtimeDb, 'wholesale_invoices');
        const invoicesSnapshot = await get(invoicesRef);
        invoicesCount = invoicesSnapshot.exists() ? Object.keys(invoicesSnapshot.val()).length : 0;
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
      
      // Fetch music tracks count
      try {
        const musicRef = ref(realtimeDb, 'musicTracks');
        const musicSnapshot = await get(musicRef);
        musicCount = musicSnapshot.exists() ? Object.keys(musicSnapshot.val()).length : 0;
      } catch (error) {
        console.error('Error fetching music tracks:', error);
      }
      
      // Fetch blog posts count from Firebase Realtime Database
      try {
        const blogRef = ref(realtimeDb, 'blogPosts');
        const blogSnapshot = await get(blogRef);
        blogCount = blogSnapshot.exists() ? Object.keys(blogSnapshot.val()).length : 0;
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
        
      // Fetch storage size
      let totalSize = 0;
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          // Helper function to recursively get all files
          const getAllFiles = async (bucketName, path = '') => {
            let size = 0;
            try {
              const { data: files, error } = await supabase.storage
                .from(bucketName)
                .list(path, { limit: 1000, offset: 0 });
              
              if (!error && files) {
                for (const file of files) {
                  // Check if it's a folder
                  if (!file.id && file.name) {
                    // Recursively get files from subdirectory
                    const subPath = path ? `${path}/${file.name}` : file.name;
                    size += await getAllFiles(bucketName, subPath);
                  } else if (file.metadata?.size) {
                    size += file.metadata.size;
                  }
                }
              }
            } catch (err) {
              console.error(`Error listing files in ${bucketName}/${path}:`, err);
            }
            return size;
          };
          
          const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
          
          if (!bucketsError && buckets) {
            for (const bucket of buckets) {
              const bucketSize = await getAllFiles(bucket.name);
              totalSize += bucketSize;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching storage size:', error);
      }
      
      // Format storage size
      const formatSize = (bytes) => {
        if (bytes === 0) return '0 MB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      };
      
      setStats({
        users: usersCount,
        invoices: invoicesCount,
        music: musicCount,
        blog: blogCount,
        storage: formatSize(totalSize)
      });
    };
    
    fetchStats();
  }, []);

  // Handle logout
  const handleLogout = () => {
    navigate('/admin/login');
  };

  // Main menu items (like Spotify's main navigation)
  const mainMenuItems = [
    { id: 'dashboard', label: 'Home', icon: Home, component: Dashboard },
    { id: 'products', label: 'Wholesale', icon: Package, component: ProductsPage },
    { id: 'wholesale', label: 'Invoices', icon: ShoppingBag, component: WholesaleManagement },
  ];

  // Library menu items (like Spotify's "Your Library" section)
  const libraryMenuItems = [
    { id: 'messages', label: 'Messages', icon: Mail, component: MessagesPage },
    { id: 'logos', label: 'Logo', icon: Image, component: LogosManagement },
    { id: 'footer', label: 'Footer', icon: Columns, component: FooterManagement },
    { id: 'passwords', label: 'Passwords', icon: Key, component: PasswordsManagement },
    { id: 'music', label: 'Music', icon: Music, component: MusicManagement },
    { id: 'blog', label: 'Blog', icon: FileText, component: BlogManagement },
    { id: 'users', label: 'Users', icon: Users, component: UsersManagement },
    { id: 'storage', label: 'Storage', icon: Database, component: StorageManagement },
  ];

  // Get current component
  const allMenuItems = [...mainMenuItems, ...libraryMenuItems];
  const CurrentComponent = allMenuItems.find(item => item.id === activeSection)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-[#121212] flex" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Enterprise Sidebar */}
      <div className="bg-black flex flex-col w-64 enterprise-sidebar">
        {/* Logo Section */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3">
            <img 
              src={logos?.adminDashboard?.url || "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"}
              alt={logos?.adminDashboard?.alt || "Kushie Admin"}
              className="h-8 w-auto object-contain"
            />
            <div>
              <h2 className="text-white font-bold text-lg">Kushie</h2>
              <p className="text-xs text-[#b3b3b3]">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 py-4">
          <div className="mb-2">
            <h3 className="px-3 text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">Main</h3>
          </div>
          <ul className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all relative ${
                      isActive
                        ? 'bg-[#282828] text-white'
                        : 'text-[#b3b3b3] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-[#b3b3b3]'
                    }`} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Configuration Section */}
        <div className="px-3 py-4 flex-1">
          <div className="mb-2">
            <h3 className="px-3 text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">Configuration</h3>
          </div>
          <ul className="space-y-1">
            {libraryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all relative ${
                      isActive
                        ? 'bg-[#282828] text-white'
                        : 'text-[#b3b3b3] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-[#b3b3b3]'
                    }`} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#282828]">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Administrator</p>
              <p className="text-xs text-[#b3b3b3]">admin@kushie.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-[#b3b3b3] hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign out</span>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#121212] flex flex-col">
        {/* Enterprise Header */}
        <header className="bg-[#121212] px-8 py-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-white">
                {allMenuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 pl-10 text-sm bg-[#282828] text-white rounded-full border-0 placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-white"
                />
                <svg className="w-5 h-5 text-[#b3b3b3] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 hover:bg-[#282828] rounded-full transition-colors relative">
                  <Bell className="w-5 h-5 text-[#b3b3b3] hover:text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#1db954] rounded-full"></span>
                </button>
              </div>
              
              {/* Help */}
              <button className="p-2 hover:bg-[#282828] rounded-full transition-colors">
                <svg className="w-5 h-5 text-[#b3b3b3] hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto bg-[#121212] admin-scrollbar">
            <div className="p-8">
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#181818] rounded-lg p-4 stats-card cursor-pointer hover:bg-[#282828] transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#b3b3b3]">Total Users</p>
                      <p className="text-2xl font-bold text-white">{stats.users}</p>
                      <p className="text-xs text-[#1db954] mt-1">↑ 12% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-[#282828] rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#1db954]" />
                    </div>
                  </div>
                </div>
                <div className="bg-[#181818] rounded-lg p-4 stats-card cursor-pointer hover:bg-[#282828] transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#b3b3b3]">Active Invoices</p>
                      <p className="text-2xl font-bold text-white">{stats.invoices}</p>
                      <p className="text-xs text-[#1db954] mt-1">↑ 8% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-[#282828] rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-[#1db954]" />
                    </div>
                  </div>
                </div>
                <div className="bg-[#181818] rounded-lg p-4 stats-card cursor-pointer hover:bg-[#282828] transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#b3b3b3]">Blog Posts</p>
                      <p className="text-2xl font-bold text-white">{stats.blog}</p>
                      <p className="text-xs text-[#1db954] mt-1">↑ 23% engagement</p>
                    </div>
                    <div className="w-12 h-12 bg-[#282828] rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#1db954]" />
                    </div>
                  </div>
                </div>
                <div className="bg-[#181818] rounded-lg p-4 stats-card cursor-pointer hover:bg-[#282828] transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#b3b3b3]">Storage Used</p>
                      <p className="text-2xl font-bold text-white">{stats.storage}</p>
                      <p className="text-xs text-[#b3b3b3] mt-1">of 100 GB</p>
                    </div>
                    <div className="w-12 h-12 bg-[#282828] rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-[#1db954]" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Component Content */}
              <CurrentComponent />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;