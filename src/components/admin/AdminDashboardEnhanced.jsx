import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Package, Globe, Home, Settings, Menu, X,
  ShoppingBag, FileText, Users, MessageSquare, Music
} from 'lucide-react';
import ProductsPage from './ProductsPage';
import WebsiteBuilder from './WebsiteBuilder';
import HomepageManagement from './HomepageManagement';
import MusicManagement from './MusicManagement';
import BlogManagement from './BlogManagement';
import UsersManagement from './UsersManagement';

const AdminDashboardEnhanced = () => {
  const [activeSection, setActiveSection] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

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

  // Menu items
  const menuItems = [
    { id: 'products', label: 'Products', icon: Package, component: ProductsPage },
    { id: 'website', label: 'Website Builder', icon: Globe, component: WebsiteBuilder },
    { id: 'homepage', label: 'Homepage Builder', icon: Home, component: HomepageManagement },
    { id: 'music', label: 'Music Player', icon: Music, component: MusicManagement },
    { id: 'blog', label: 'Blog Posts', icon: FileText, component: BlogManagement },
    { id: 'users', label: 'Users', icon: Users, component: UsersManagement },
  ];

  // Get current component
  const CurrentComponent = menuItems.find(item => item.id === activeSection)?.component || ProductsPage;

  return (
    <div className="min-h-screen bg-spotify-black flex">
      {/* Sidebar */}
      <div className={`bg-spotify-light-gray transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col`}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-spotify-gray">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-white transition-opacity ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-spotify-green text-black'
                        : 'text-gray-300 hover:bg-spotify-gray hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`font-medium transition-opacity ${
                      sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-spotify-gray">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-spotify-gray hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium transition-opacity ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-spotify-light-gray border-b border-spotify-gray px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h2>
        </header>

        {/* Content Area */}
        <main className="p-8 overflow-y-auto h-[calc(100vh-88px)]">
          <CurrentComponent />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;