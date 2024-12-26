import React from 'react'
import { GoogleLogin } from '@react-oauth/google'

const LoginPage = () => {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('SUCCESS RESPONSE:', credentialResponse)
  }

  const handleGoogleFailure = () => {
    console.log('an error occured')
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-slate-900'>
      {/* Left Column - Hidden on mobile */}
      <div className='hidden md:flex md:w-1/2 bg-slate-800 items-center justify-center'>
        <div className='text-center'>
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
          <h1 className='text-3xl md:text-4xl font-bold text-blue-400'>
            Welcome Back
          </h1>
          <p className='mt-4 text-slate-400'>
            Sign in to access your dashboard
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className='w-full md:w-1/2 min-h-screen md:min-h-0 flex items-center justify-center bg-slate-900 px-4 md:p-0'>
        <div className='w-full max-w-md p-6 shadow-lg border border-slate-700 rounded-lg bg-slate-800 my-auto'>
          <h2 className='text-xl md:text-2xl font-bold text-center text-white mb-6'>
            Log In
          </h2>
          <form className='space-y-4'>
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
                className='mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-white placeholder-slate-400'
                placeholder='Enter your password'
              />
            </div>
            <button
              type='submit'
              className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800
                       transition-colors duration-200'
            >
              Log In
            </button>
          </form>

          {/* Divider */}
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

          {/* Google Login Button */}
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
            Don't have an account?{' '}
            <a
              href='/signup'
              className='text-blue-400 hover:text-blue-300 hover:underline'
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
