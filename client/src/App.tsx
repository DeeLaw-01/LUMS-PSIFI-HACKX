import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/Components/ui/toaster.tsx'

import { useAuthStore } from '@/store/useAuthStore'
import AuthPage from '@/Pages/Auth/LoginPage'
import HomePage from '@/Pages/HomePage/HomePage.tsx'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

export default function App () {
  const { user } = useAuthStore()

  return (
    <>
      <Navbar />
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

        {/* Catch all - redirect to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
      <Footer />
    </>
  )
}
