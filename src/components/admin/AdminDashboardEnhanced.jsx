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
  Image, Columns, Key
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
import NotificationSystem from './NotificationSystem';
import { useLogos } from '../../context/LogosContext';

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
    <div className="min-h-screen bg-black flex">
      {/* Spotify-style Sidebar */}
      <div className="bg-black flex flex-col w-[72px]">
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center justify-center w-12 h-12 hover:bg-[#282828] rounded-md transition-colors"
              title="Dashboard Home"
            >
              <img 
                src={logos?.adminDashboard?.url || "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"}
                alt={logos?.adminDashboard?.alt || "Kushie Admin"}
                className="max-w-full max-h-full object-contain"
                style={{
                  width: logos?.adminDashboard?.width === 'auto' ? 'auto' : `${logos?.adminDashboard?.width}px`,
                  height: logos?.adminDashboard?.height === 'auto' ? 'auto' : `${logos?.adminDashboard?.height}px`,
                }}
              />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-2">
          <ul className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-center px-3 py-3 rounded-md transition-all group ${
                      isActive
                        ? 'text-white bg-[#282828]'
                        : 'text-[#b3b3b3] hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className={`w-6 h-6 flex-shrink-0 ${
                      isActive ? 'text-[#CB6015]' : 'text-[#b3b3b3] group-hover:text-white'
                    }`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className="mx-6 my-4 h-px bg-[#282828]" />

        {/* Library Section */}
        <div className="px-2 flex-1">
          <ul className="space-y-1 mt-2">
            {libraryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-center px-3 py-3 rounded-md transition-all group ${
                      isActive
                        ? 'text-white bg-[#282828]'
                        : 'text-[#b3b3b3] hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'text-[#CB6015]' : 'text-[#b3b3b3] group-hover:text-white'
                    }`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#282828]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-3 rounded-md text-[#b3b3b3] hover:text-white transition-all group"
            title="Log out"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#121212] flex flex-col">
        {/* Spotify-style Header */}
        <header className="bg-[#070707] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
          {/* Empty left side for balance */}
          <div></div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <NotificationSystem />
            <button className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center text-white font-semibold hover:bg-[#3e3e3e] transition-colors">
              A
            </button>
          </div>
        </header>

        {/* Content Area with Spotify gradient */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {/* Gradient Background */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#CB6015] via-[#121212] to-[#121212] h-[332px]" />
              <div className="relative z-10 p-8">
                <CurrentComponent />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;