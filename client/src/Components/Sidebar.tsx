import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'

import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <div className='w-full md:w-1/3 space-y-4'>
      <div className='bg-white rounded-lg shadow p-4'>
        <img
          src={`https://ui-avatars.com/api/?name=${
            user?.username || 'Anonymous'
          }&background=random`}
          alt={user?.username || 'Anonymous'}
          className='w-20 h-20 rounded-full mx-auto mb-4'
        />
        <h2 className='text-xl font-semibold text-center'>
          {user?.username || 'Anonymous'}
        </h2>
        <p className='text-gray-500 text-center'>
          {user?.bio || 'No bio available'}
        </p>
        {user?.startup && (
          <div className='mt-4'>
            <h3 className='font-semibold'>Associated Startup:</h3>
            <Link
              //@ts-ignore
              to={`/startup/${user.startup.id}`}
              className='text-blue-600 hover:underline'
            >
              {/* @ts-ignore */}
              {user.startup.name}
            </Link>
            {/* @ts-ignore */}
            <p className='text-sm text-gray-500'>{user.startup.position}</p>
          </div>
        )}
      </div>
      <div className='bg-white rounded-lg shadow p-4'>
        <h3 className='font-semibold mb-2'>Suggested Connections</h3>
        <ul className='space-y-2'>
          <li className='flex items-center justify-between'>
            <div className='flex items-center'>
              <img
                src='https://ui-avatars.com/api/?name=Jane+Doe&background=random'
                alt='Jane Doe'
                className='w-8 h-8 rounded-full mr-2'
              />
              <span>Jane Doe</span>
            </div>
            <button className='text-blue-600 hover:underline'>Connect</button>
          </li>
          <li className='flex items-center justify-between'>
            <div className='flex items-center'>
              <img
                src='https://ui-avatars.com/api/?name=Bob+Smith&background=random'
                alt='Bob Smith'
                className='w-8 h-8 rounded-full mr-2'
              />
              <span>Bob Smith</span>
            </div>
            <button className='text-blue-600 hover:underline'>Connect</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
