import './App.css'
import './styles/typography.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import { PageContentProvider } from './context/PageContentContext'
import { HomepageProvider } from './context/HomepageContext'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { MusicProvider } from './context/MusicContext'
import { BlogProvider } from './context/BlogContext'
import { WishlistProvider } from './context/WishlistContext'
import SpotifyLayout from './components/SpotifyLayout'
import SpotifyHome from './components/SpotifyHome'
import AgeVerification from './components/AgeVerification'
import ScrollToTop from './components/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'

// Import user sync utility (will auto-start syncing)
import './utils/syncUsersToRealtimeDB'

// Lazy load admin components
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AdminDashboardEnhanced = lazy(() => import('./components/admin/AdminDashboardEnhanced'))

// Lazy load pages
const About = lazy(() => import('./pages/About'))
const Shop = lazy(() => import('./pages/Shop'))
const Wholesale = lazy(() => import('./pages/Wholesale'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Underage = lazy(() => import('./pages/Underage'))


function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <ProductsProvider>
          <CartProvider>
            <WishlistProvider>
              <PageContentProvider>
                <HomepageProvider>
                  <MusicProvider>
                    <BlogProvider>
                      <Router>
                    <ScrollToTop />
                    <div className="min-h-screen bg-black">
                    <AgeVerification />
                    <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminLogin />
                  </Suspense>
                } />
                <Route path="/admin" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminDashboardEnhanced />
                  </Suspense>
                } />
                <Route path="/admin/simple" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminDashboard />
                  </Suspense>
                } />
                
                {/* Public Routes */}
                <Route path="*" element={
                  <SpotifyLayout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<SpotifyHome />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/wholesale" element={<Wholesale />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/underage" element={<Underage />} />
                      </Routes>
                    </Suspense>
                  </SpotifyLayout>
                } />
              </Routes>
            </div>
                      </Router>
                    </BlogProvider>
                  </MusicProvider>
                </HomepageProvider>
              </PageContentProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductsProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App