import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from '@/Components/ui/toaster.tsx'
import ScrollToTop from './Components/ScrollToTop'
import RouteScrollToTop from './Components/RouteScrollToTop'
import { ThemeProvider } from './Components/theme-provider.tsx'
import { useAuthStore } from '@/store/useAuthStore'
import AuthPage from '@/Pages/Auth/Auth.tsx'
import HomePage from '@/Pages/HomePage/HomePage.tsx'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SavedPosts from '@/Pages/SavedPosts/SavedPosts'
import UserDashboard from '@/Pages/Dashboard/UserDashboard'
import StartupOnboarding from './Pages/Onboarding/StartupOnboarding.tsx'
import JoinStartup from './Pages/Startup/JoinStartup'
import StartupSection from './Pages/Dashboard/Components/StartupSection'
import CreateStartup from './Pages/Startup/CreateStartup'
import StartupPage from './Pages/StartupPage/StartupPage'
import UserProfile from './Pages/Profile/UserProfile'
import SinglePostPage from '@/Pages/Post/SinglePostPage'
import StartupsPage from '@/Pages/Startups/StartupsPage'

const NAVBAR_EXCLUDED_ROUTES = ['/auth', '/onboarding']
const FOOTER_EXCLUDED_ROUTES = ['/auth', '/', '/']

export default function App () {
  const { user, isNewUser } = useAuthStore()
  const location = useLocation()

  const showNavbar = !NAVBAR_EXCLUDED_ROUTES.includes(location.pathname)
  const showFooter = !FOOTER_EXCLUDED_ROUTES.includes(location.pathname)

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='min-h-screen '>
        <RouteScrollToTop />
        {showNavbar && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route
            path='/auth'
            element={!user ? <AuthPage /> : <Navigate to='/' replace />}
          />
          {/* Protected Routes */}
          <Route
            path='/'
            element={
              user ? (
                isNewUser ? (
                  <Navigate to='/onboarding' replace />
                ) : (
                  <HomePage />
                )
              ) : (
                <Navigate to='/auth' replace />
              )
            }
          />
          <Route
            path='/startups'
            element={user ? <StartupsPage /> : <Navigate to='/auth' replace />}
          />
          <Route
            path='/saved'
            element={user ? <SavedPosts /> : <Navigate to='/auth' replace />}
          />
          <Route
            path='/dashboard'
            element={user ? <UserDashboard /> : <Navigate to='/auth' replace />}
          />

          <Route
            path='/onboarding'
            element={
              user && isNewUser ? (
                <StartupOnboarding />
              ) : (
                <Navigate to='/' replace />
              )
            }
          />
          <Route
            path='/startup/join'
            element={user ? <JoinStartup /> : <Navigate to='/auth' replace />}
          />
          <Route
            path='/dashboard/startups'
            element={
              user ? <StartupSection /> : <Navigate to='/auth' replace />
            }
          />
          <Route
            path='/startup/create'
            element={
              user ? <CreateStartup /> : <Navigate to='/auth' replace />
            }
          />
          <Route
            path='/startup/:id'
            element={user ? <StartupPage /> : <Navigate to='/auth' replace />}
          />
        
          <Route
            path='/profile/:id'
            element={user ? <UserProfile /> : <Navigate to='/auth' replace />}
          />

          {/* New Route for Single Post View */}
          <Route
            path='/post/:id'
            element={<SinglePostPage />}
          />

          {/* Catch all - redirect to home */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Toaster />
        <ScrollToTop />
        {showFooter && <Footer />}
      </div>
    </ThemeProvider>
  )
}
