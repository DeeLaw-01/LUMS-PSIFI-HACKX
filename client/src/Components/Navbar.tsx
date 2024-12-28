import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModeToggle } from './ui/mode-toggle.tsx'
import {
  Menu,
  X,
  Search,
  PlusSquare,
  UserCircle,
  LogOut,
  LayoutDashboard,
  Bell
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './SearchBar'
import NotificationDropdown from './Navbar/NotificationDropdown'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function logout () {
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsMobileSearchOpen(false)
  }

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen)
    setIsMobileMenuOpen(false)
  }

  const navigateToProfile = () => {
    navigate('/profile')
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsProfileDropdownOpen(false)
    navigate('/')
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  return (
    <>
      <nav className='dark:bg-primary-800 bg-white dark:border-b shadow-lg border-slate-800 p-4 fixed top-0 w-full z-40'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          {/* Logo */}
          <div
            className='text-red-500 font-bold text-2xl cursor-pointer'
            onClick={() => navigate('/')}
          >
            SPARKUP
          </div>

          {/* Search Bar - Desktop */}
          <div className='hidden lg:block flex-grow max-w-xl mx-8'>
            <SearchBar />
          </div>

          {/* Mobile Menu Icon */}
          <div className='lg:hidden flex items-center gap-4'>
            <button
              onClick={toggleMobileSearch}
              className='text-black dark:text-slate-300 hover:text-blue-400 transition-colors'
            >
              <Search className='w-6 h-6' />
            </button>
            <PlusSquare
              className='w-6 h-6 text-black dark:text-slate-300 cursor-pointer hover:text-blue-400 transition-colors'
              onClick={() => navigate('/create-post')}
            />
            <button
              onClick={toggleMobileMenu}
              className='text-black dark:text-slate-300 hover:text-blue-400 transition-colors'
            >
              {isMobileMenuOpen ? (
                <X className='w-7 h-7' />
              ) : (
                <Menu className='w-7 h-7' />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-8'>
            <div className='flex space-x-6 text-black dark:text-slate-300'>
              <button
                onClick={() => navigate('/')}
                className='hover:text-blue-400 transition-colors'
              >
                Home
              </button>
              <button
                onClick={() => navigate('/startups')}
                className='hover:text-blue-400 transition-colors'
              >
                Startups
              </button>
            </div>

            {/* Notifications Dropdown */}
            <NotificationDropdown />

            {/* User Profile Section with Dropdown */}
            <div className='relative' ref={dropdownRef}>
              <div
                onClick={toggleProfileDropdown}
                className='cursor-pointer flex items-center space-x-3 hover:opacity-80 transition-opacity'
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className='w-9 h-9 rounded-full border-2 border-red-500/50'
                  />
                ) : (
                  <UserCircle className='w-9 h-9 text-slate-300' />
                )}
              </div>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='absolute right-0 mt-2 w-48 rounded-md shadow-lg dark:bg-primary-800 bg-white border border-slate-700'
                  >
                    <div className='py-1'>
                      <button
                        onClick={() => {
                          navigate('/dashboard')
                          setIsProfileDropdownOpen(false)
                        }}
                        className='flex items-center w-full px-4 py-2 text-sm dark:text-slate-300 text-black dark:hover:bg-primary-700 hover:bg-red-500 hover:text-slate-100'
                      >
                        <LayoutDashboard className='w-4 h-4 mr-2' />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className='flex items-center w-full px-4 py-2 text-sm dark:text-red-500 text-red-500 dark:hover:bg-primary-700 hover:bg-red-700 hover:text-red-400'
                      >
                        <LogOut className='w-4 h-4 mr-2' />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='lg:hidden absolute left-0 right-0 top-full mt-2 px-4 pb-4 bg-inherit border-b border-slate-700'
            >
              <SearchBar />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed top-[73px] left-0 right-0 bottom-0 dark:bg-primary-800 bg-white backdrop-blur-sm z-30
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:hidden
        `}
      >
        {/* User Profile Section - Mobile */}
        {user && (
          <div className='px-6 py-4 border-b border-red-500 flex items-center space-x-4'>
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className='w-12 h-12 rounded-full border-2 border-blue-500/50'
              />
            ) : (
              <UserCircle className='w-12 h-12 dark:text-slate-300 text-black' />
            )}
            <div className='flex flex-col'>
              <span className='font-medium'>{user.username}</span>
              <span className='text-sm'>{user.email}</span>
            </div>
          </div>
        )}

        {/* Mobile Navigation Links */}
        <div className='flex flex-col items-center space-y-1 w-full text-black dark:text-slate-300 px-6 py-4'>
          {['Home', 'Startups', 'About'].map(item => (
            <button
              key={item}
              onClick={() => {
                navigate(`/${item.toLowerCase()}`)
                setIsMobileMenuOpen(false)
              }}
              className='w-full text-left text-lg font-medium 
                       hover:text-blue-400 transition-colors py-3 px-4 rounded-lg
                       hover:bg-slate-800/50'
            >
              {item}
            </button>
          ))}
          
          {/* Mode Toggle in Mobile Menu */}
          <div className='w-full pt-4 border-t border-slate-700 mt-4'>
            <div className='flex items-center justify-between px-4'>
              <span className='text-sm font-medium'>Theme</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
