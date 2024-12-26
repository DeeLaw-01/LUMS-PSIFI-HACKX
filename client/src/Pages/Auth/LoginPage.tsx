import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
  const { setUser, setToken } = useAuthStore()
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

      // Validate required fields
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
      console.log(response.data)

      setUser(response.data.user)
      setToken(response.data.token)

      toast({
        title: 'Success',
        description: `Successfully ${isLogin ? 'logged in' : 'registered'}!`
      })

      navigate('/')
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
      console.log('decoded: ', decoded)
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

      toast({
        title: 'Success',
        description: 'Successfully logged in with Google'
      })

      navigate('/')
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

  // Subtle fade and slide animation variants
  const pageTransition = {
    initial: {
      opacity: 0,
      y: isLogin ? -20 : 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: isLogin ? 20 : -20
    }
  }

  // Subtle fade animation for left column content
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-slate-900'>
      {/* Left Column - Hidden on mobile */}
      <div className='hidden md:flex md:w-1/2 bg-slate-800 items-center justify-center'>
        <motion.div
          className='text-center'
          initial='initial'
          animate='animate'
          variants={fadeIn}
          transition={{ duration: 0.4 }}
        >
          <div className='mb-8'>
            <svg
              className='w-64 h-64 mx-auto text-blue-500'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 16V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V16'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
              <path
                d='M2 16H22V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V16Z'
                stroke='currentColor'
                strokeWidth='2'
              />
            </svg>
          </div>
          <motion.h1
            className='text-3xl md:text-4xl font-bold text-blue-400'
            variants={fadeIn}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {isLogin ? 'Welcome Back' : 'Join Us Today'}
          </motion.h1>
          <motion.p
            className='mt-4 text-slate-400'
            variants={fadeIn}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {isLogin
              ? 'Sign in to access your dashboard'
              : 'Create your account to get started'}
          </motion.p>
        </motion.div>
      </div>

      {/* Right Column */}
      <div className='w-full md:w-1/2 min-h-screen md:min-h-0 flex items-center justify-center bg-slate-900 px-4 md:p-0'>
        <div className='w-full max-w-md p-6 shadow-lg border border-slate-700 rounded-lg bg-slate-800 my-auto'>
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={isLogin ? 'login' : 'register'}
              variants={pageTransition}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{
                type: 'tween',
                duration: 0.3,
                ease: 'easeInOut'
              }}
            >
              <h2 className='text-xl md:text-2xl font-bold text-center text-white mb-6'>
                {isLogin ? 'Log In' : 'Create Account'}
              </h2>
              <form className='space-y-4' onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label
                      htmlFor='username'
                      className='block text-sm font-medium text-slate-300'
                    >
                      Username
                    </label>
                    <input
                      type='text'
                      id='username'
                      value={formData.username}
                      onChange={handleInputChange}
                      className='mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               text-white placeholder-slate-400'
                      placeholder='Choose a username'
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-slate-300'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-white placeholder-slate-400'
                    placeholder='Enter your email'
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-slate-300'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             text-white placeholder-slate-400'
                    placeholder='Enter your password'
                  />
                </div>
                ;
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg 
             hover:bg-blue-700 focus:outline-none focus:ring-2 
             focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800
             transition-colors duration-200 disabled:opacity-50'
                >
                  {isLoading
                    ? 'Loading...'
                    : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
                </button>
              </form>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-slate-600'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 text-slate-400 bg-slate-800'>
                    Or continue with
                  </span>
                </div>
              </div>

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

              <p className='mt-6 text-sm text-center text-slate-400'>
                {isLogin
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className='text-blue-400 hover:text-blue-300 hover:underline'
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
