import { useAuthStore } from '@/store/useAuthStore'

export default function HomePage () {
  const { user, setUser } = useAuthStore()

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-gray-900'>
          Welcome to StartupConnect
        </h1>
        <p className='mt-4 text-xl text-gray-600'>
          Connect with startups and entrepreneurs in your area
        </p>
        <button
          onClick={() => {
            console.log(user)
          }}
        >
          LOG USER
        </button>

        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  )
}
