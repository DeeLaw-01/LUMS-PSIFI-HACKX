import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/Components/ui/button'
import { UserNav } from './UserNav'
import NotificationDropdown from './NotificationDropdown'
import { Logo } from '../Logo'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <Logo className='cursor-pointer' onClick={() => navigate('/')} />
        <div className='ml-auto flex items-center space-x-4'>
          {user ? (
            <>
              <NotificationDropdown />
              <UserNav />
            </>
          ) : (
            <>
              <Button variant='ghost' onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar 