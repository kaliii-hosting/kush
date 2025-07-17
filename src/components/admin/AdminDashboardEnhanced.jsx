import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Package, Globe, Home, Settings, Menu, X,
  ShoppingBag, FileText, Users, MessageSquare, Music, Database,
  Search, Bell, ChevronLeft, ChevronRight, Play, Library, Plus,
  Image, Columns
} from 'lucide-react';
import ProductsPage from './ProductsPage';
import WebsiteBuilderEnhanced from './WebsiteBuilderEnhanced';
import WholesaleManagement from './WholesaleManagement';
import MusicManagement from './MusicManagement';
import BlogManagement from './BlogManagement';
import UsersManagement from './UsersManagement';
import StorageManagement from './StorageManagement';
import Dashboard from './Dashboard';
import LogosManagement from './LogosManagement';
import FooterManagement from './FooterManagement';
import { useLogos } from '../../context/LogosContext';

const AdminDashboardEnhanced = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { logos } = useLogos();

  // Check auth state
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  // Main menu items (like Spotify's main navigation)
  const mainMenuItems = [
    { id: 'dashboard', label: 'Home', icon: Home, component: Dashboard },
    { id: 'products', label: 'Products', icon: Package, component: ProductsPage },
    { id: 'wholesale', label: 'Wholesale', icon: ShoppingBag, component: WholesaleManagement },
    { id: 'website', label: 'Website Builder', icon: Globe, component: WebsiteBuilderEnhanced },
  ];

  // Library menu items (like Spotify's "Your Library" section)
  const libraryMenuItems = [
    { id: 'logos', label: 'Logo Management', icon: Image, component: LogosManagement },
    { id: 'footer', label: 'Footer Management', icon: Columns, component: FooterManagement },
    { id: 'music', label: 'Music Player', icon: Music, component: MusicManagement },
    { id: 'blog', label: 'Blog Posts', icon: FileText, component: BlogManagement },
    { id: 'users', label: 'Users', icon: Users, component: UsersManagement },
    { id: 'storage', label: 'Storage', icon: Database, component: StorageManagement },
  ];

  // Get current component
  const allMenuItems = [...mainMenuItems, ...libraryMenuItems];
  const CurrentComponent = allMenuItems.find(item => item.id === activeSection)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Spotify-style Sidebar */}
      <div className={`bg-black flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-[72px]'
      }`}>
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center">
            {sidebarOpen ? (
              <img 
                src={logos?.adminDashboard?.url || "https://fchtwxunzmkzbnibqbwl.supabase.co/storage/v1/object/public/kushie01/logos/Logo%20Kushie%20(W-SVG).svg"}
                alt={logos?.adminDashboard?.alt || "Kushie Admin"}
                style={{
                  width: logos?.adminDashboard?.width === 'auto' ? 'auto' : `${logos?.adminDashboard?.width}px`,
                  height: logos?.adminDashboard?.height === 'auto' ? 'auto' : `${logos?.adminDashboard?.height}px`,
                  maxHeight: '40px'
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">K</span>
              </div>
            )}
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
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all group ${
                      isActive
                        ? 'text-white bg-[#282828]'
                        : 'text-[#b3b3b3] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-[#b3b3b3] group-hover:text-white'
                    }`} />
                    {sidebarOpen && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
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
          {sidebarOpen && (
            <div className="px-4 py-2 flex items-center justify-between">
              <h3 className="text-[#b3b3b3] text-sm font-medium">Your Library</h3>
              <button className="text-[#b3b3b3] hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <ul className="space-y-1 mt-2">
            {libraryMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all group ${
                      isActive
                        ? 'text-white bg-[#282828]'
                        : 'text-[#b3b3b3] hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-md ${
                      isActive ? 'bg-[#404040]' : 'bg-[#282828] group-hover:bg-[#404040]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {sidebarOpen && (
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-[#a7a7a7]">Admin section</p>
                      </div>
                    )}
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
            className="w-full flex items-center gap-4 px-4 py-3 rounded-md text-[#b3b3b3] hover:text-white transition-all group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="font-medium text-sm">Log out</span>
            )}
          </button>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 -right-3 w-6 h-6 bg-black border border-[#282828] rounded-full flex items-center justify-center hover:bg-[#282828] transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3 text-white" /> : <ChevronRight className="w-3 h-3 text-white" />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#121212] flex flex-col">
        {/* Spotify-style Header */}
        <header className="bg-[#070707] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center cursor-not-allowed opacity-60">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center cursor-not-allowed opacity-60">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            
            {/* Search Bar */}
            <div className="relative ml-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
              <input
                type="text"
                placeholder="What do you want to manage?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-96 bg-[#242424] text-white pl-10 pr-4 py-2 rounded-full placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
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
              <div className="absolute inset-0 bg-gradient-to-b from-[#1e3c72] via-[#121212] to-[#121212] h-[332px]" />
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