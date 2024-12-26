import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
const Header: React.FC = () => {
  const { user, setUser } = useAuthStore()

  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className=' shadow'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link to='/' className='text-2xl font-bold text-blue-600'>
            StartupConnect
          </Link>
          <nav>
            <ul className='flex space-x-4'>
              <li>
                <Link to='/' className='text-gray-600 hover:text-blue-600'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/search'
                  className='text-gray-600 hover:text-blue-600'
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to='/messaging'
                  className='text-gray-600 hover:text-blue-600'
                >
                  Messaging
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className='flex items-center space-x-4'>
          <form onSubmit={handleSearch}>
            <input
              type='text'
              name='search'
              placeholder='Search startups...'
              className='px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600'
            />
          </form>
          {user ? (
            <button
              onClick={() => {
                setUser(null)
              }}
              className='bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300'
            >
              Sign Out
            </button>
          ) : (
            <button className='bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300'>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
