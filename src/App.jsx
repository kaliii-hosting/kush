import './App.css'
import './styles/typography.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import SpotifyLayout from './components/SpotifyLayout'
import SpotifyHome from './components/SpotifyHome'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import About from './pages/About'
import Shop from './pages/Shop'
import Wholesale from './pages/Wholesale'
import Contact from './pages/Contact'
import AgeVerification from './components/AgeVerification'
import Underage from './pages/Underage'


function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-black">
          <AgeVerification />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Public Routes */}
            <Route path="*" element={
              <SpotifyLayout>
                <Suspense fallback={
                  <div className="flex items-center justify-center h-screen">
                    <div className="text-white text-xl">Loading...</div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<SpotifyHome />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/wholesale" element={<Wholesale />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/underage" element={<Underage />} />
                  </Routes>
                </Suspense>
              </SpotifyLayout>
            } />
          </Routes>
        </div>
      </Router>
      </CartProvider>
    </ProductsProvider>
  )
}

export default App