import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button.tsx'

interface GoogleUser {
  email: string
  name: string
  picture: string
  sub: string
}

interface FormData {
  username: string
  email: string
  password: string
}

const LoginPage = () => {
  const { toast } = useToast()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  })
  const { setUser, setToken, setIsNewUser } = useAuthStore()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      if (
        !formData.email ||
        !formData.password ||
        (!isLogin && !formData.username)
      ) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
        return
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/${
          isLogin ? 'login' : 'register'
        }`,
        formData
      )

      setUser(response.data.user)
      setToken(response.data.token)
      setIsNewUser(response.data.isNewUser)

      if (response.data.isNewUser) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }

      toast({
        title: 'Success',
        description: `Successfully ${isLogin ? 'logged in' : 'registered'}!`
      })
    } catch (error: any) {
      console.error('Auth error:', error)
      toast({
        title: 'Authentication Failed',
        description:
          error.response?.data?.message || 'An unknown error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      setIsLoading(true)
      if (!credentialResponse.credential) {
        toast({
          title: 'Authentication Failed',
          description: 'No credentials received from Google',
          variant: 'destructive'
        })
        return
      }
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google/verify`,
        {
          credential: credentialResponse.credential,
          email: decoded.email,
          username: decoded.name,
          profilePicture: decoded.picture
        }
      )
      setUser(response.data.user)
      setToken(response.data.token)
      setIsNewUser(response.data.isNewUser)

      if (response.data.isNewUser) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }

      toast({
        title: 'Success',
        description: 'Successfully logged in with Google'
      })
    } catch (error: any) {
      console.error('Google auth error:', error)
      toast({
        title: 'Google Authentication Failed',
        description:
          error.response?.data?.message ||
          'An error occurred during Google sign-in',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleFailure = () => {
    toast({
      title: 'Google Sign-in Failed',
      description: 'Unable to sign in with Google. Please try again.',
      variant: 'destructive'
    })
  }

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-black'>
      <div className='flex-1 flex items-center justify-center'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={isLogin ? 'login' : 'register'}
            variants={pageTransition}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={{ duration: 0.3 }}
            className='w-full max-w-md'
          >
            <div className='bg-white dark:bg-primary-800 shadow-2xl rounded-lg p-8'>
              <h2 className='text-3xl font-bold text-center text-gray-800 dark:text-white mb-8'>
                {isLogin ? 'Welcome Back' : 'Join Us Today'}
              </h2>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {!isLogin && (
                  <Input
                    type='text'
                    id='username'
                    placeholder='Username'
                    value={formData.username}
                    onChange={handleInputChange}
                    className='w-full'
                  />
                )}
                <Input
                  type='email'
                  id='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full'
                />
                <Input
                  type='password'
                  id='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='w-full'
                />
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-red-500 hover:bg-red-600 text-white'
                >
                  {isLoading
                    ? 'Loading...'
                    : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
                </Button>
              </form>

              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600 dark:text-white'>
                  {isLogin
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className='text-red-500 hover:text-red-600 font-medium'
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              <div className='mt-8'>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white dark:bg-primary-900 text-gray-500 dark:text-white rounded-md'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className='mt-6'>
                  <div className='flex justify-center'>
                    <GoogleLogin
                      onSuccess={credentialResponse => {
                        handleGoogleSuccess(credentialResponse)
                      }}
                      onError={() => {
                        handleGoogleFailure()
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='hidden lg:flex flex-1 items-center justify-center bg-red-500 dark:bg-red-600'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-white mb-4'>
            Connect and Grow
          </h1>
          <p className='text-xl text-white'>Your startup journey begins here</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
