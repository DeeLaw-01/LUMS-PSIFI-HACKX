import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/Components/ui/toaster.tsx'
import ScrollToTop from './Components/ScrollToTop'
import RouteScrollToTop from './Components/RouteScrollToTop'

import { useAuthStore } from '@/store/useAuthStore'
import AuthPage from '@/Pages/Auth/LoginPage'
import HomePage from '@/Pages/HomePage/HomePage.tsx'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SavedPosts from '@/Pages/SavedPosts/SavedPosts'

const NAVBAR_EXCLUDED_ROUTES = ['/auth']
const FOOTER_EXCLUDED_ROUTES = ['/auth', '/']

export default function App () {
  const { user } = useAuthStore()
  const location = useLocation()

  const showNavbar = !NAVBAR_EXCLUDED_ROUTES.includes(location.pathname)
  const showFooter = !FOOTER_EXCLUDED_ROUTES.includes(location.pathname)

  return (
    <div className='min-h-screen flex pb-8'>
      <RouteScrollToTop />
      {showNavbar && <Navbar />}
      <div className='flex-1'>
        <Routes>
          {/* Public Routes */}
          <Route
            path='/auth'
            element={!user ? <AuthPage /> : <Navigate to='/' replace />}
          />

          {/* Protected Routes */}
          <Route
            path='/'
            element={user ? <HomePage /> : <Navigate to='/auth' replace />}
          />
          <Route
            path='/saved'
            element={user ? <SavedPosts /> : <Navigate to='/auth' replace />}
          />

          {/* Catch all - redirect to home */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
      <Toaster />
      {showFooter && <Footer />}
      <ScrollToTop />
    </div>
  )
}
