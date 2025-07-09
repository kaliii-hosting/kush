import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import { ProductsProvider } from './context/ProductsContext'
import Navbar from './components/Navbar'
import Hero3DShop from './components/hero/Hero3DShop'
import UnmatchedProductivity from './components/UnmatchedProductivity'
import WorkTogether from './components/WorkTogether'
import SyncWithGithub from './components/SyncWithGithub'
import MetaBrain from './components/MetaBrain'
import Knowledge from './components/Knowledge'
import JoinMovement from './components/JoinMovement'
import Footer from './components/Footer'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'

function HomePage() {
  return (
    <>
      <Hero3DShop />
      <UnmatchedProductivity />
      <WorkTogether />
      <SyncWithGithub />
      <MetaBrain />
      <Knowledge />
      <JoinMovement />
    </>
  )
}

function App() {
  return (
    <ProductsProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Public Routes */}
            <Route path="*" element={
              <>
                <Navbar />
                <Suspense fallback={
                  <div className="flex items-center justify-center h-screen">
                    <div className="text-white text-xl">Loading...</div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                  </Routes>
                </Suspense>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ProductsProvider>
  )
}

export default App