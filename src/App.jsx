import React, { Suspense, lazy } from 'react'
import './App.css'
import './styles/typography.css'
import './styles/sections.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductsProvider } from './context/ProductsContext'
import { ShopifyCartProvider } from './context/ShopifyCartContext'
import { PageContentProvider } from './context/PageContentContext'
import { HomepageProvider } from './context/HomepageContext'
import { AuthProvider } from './context/AuthContext'
import { LogosProvider } from './context/LogosContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { MusicProvider } from './context/MusicContext'
import { BlogProvider } from './context/BlogContext'
import { WishlistProvider } from './context/WishlistContext'
import { ShopifyProvider } from './context/ShopifyContext'
import { EnhancedProductsProvider } from './context/EnhancedProductsContext'
import { WholesaleCartProvider } from './context/WholesaleCartContext'
import SpotifyLayout from './components/SpotifyLayout'
import SpotifyHomeDynamic from './components/SpotifyHomeDynamic'
import AgeVerification from './components/AgeVerification'
import ScrollToTop from './components/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'
import useResourcePreloader from './hooks/useResourcePreloader'

// Import user sync utility (will auto-start syncing)
import './utils/syncUsersToRealtimeDB'

// Lazy load admin components
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AdminDashboardEnhanced = lazy(() => import('./components/admin/AdminDashboardEnhanced'))

// Lazy load pages
const AboutDynamic = lazy(() => import('./pages/AboutDynamic'))
const ShopDynamic = lazy(() => import('./pages/ShopDynamic'))
const WholesaleDynamic = lazy(() => import('./pages/WholesaleDynamic'))
const ContactDynamic = lazy(() => import('./pages/ContactDynamic'))
const Blog = lazy(() => import('./pages/Blog'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Account = lazy(() => import('./pages/Account'))
const Underage = lazy(() => import('./pages/Underage'))


function App() {
  useResourcePreloader();
  
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <ProductsProvider>
          <ShopifyProvider>
            <EnhancedProductsProvider>
              <ShopifyCartProvider>
                <WholesaleCartProvider>
                  <WishlistProvider>
                    <LogosProvider>
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
                        <Route path="/" element={<SpotifyHomeDynamic />} />
                        <Route path="/about" element={<AboutDynamic />} />
                        <Route path="/shop" element={<ShopDynamic />} />
                        <Route path="/wholesale" element={<WholesaleDynamic />} />
                        <Route path="/contact" element={<ContactDynamic />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/account" element={<Account />} />
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
                    </LogosProvider>
                  </WishlistProvider>
                </WholesaleCartProvider>
              </ShopifyCartProvider>
            </EnhancedProductsProvider>
          </ShopifyProvider>
        </ProductsProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App