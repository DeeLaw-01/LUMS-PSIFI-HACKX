import React from 'react'
import { useParams } from 'react-router-dom'
import Timeline from '../../Components/Timeline.tsx'

const StartupProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // Mock startup data (replace with actual data fetching)
  const startup = {
    id,
    name: 'TechStartup Inc.',
    logo: 'https://ui-avatars.com/api/?name=TechStartup&background=random',
    description: 'Innovative solutions for the modern world',
    industries: ['SaaS', 'AI', 'Machine Learning'],
    fundingRaised: '$5M'
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white rounded-lg shadow p-6 mb-6'>
        <div className='flex items-center mb-4'>
          <img
            src={startup.logo}
            alt={startup.name}
            className='w-20 h-20 rounded-full mr-4'
          />
          <div>
            <h1 className='text-2xl font-bold'>{startup.name}</h1>
            <p className='text-gray-600'>{startup.description}</p>
          </div>
        </div>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold mb-2'>Industries</h2>
          <div className='flex flex-wrap gap-2'>
            {startup.industries.map((industry, index) => (
              <span
                key={index}
                className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className='text-xl font-semibold mb-2'>Funding Raised</h2>
          <p className='text-2xl font-bold text-green-600'>
            {startup.fundingRaised}
          </p>
        </div>
      </div>
      <Timeline />
    </div>
  )
}

export default StartupProfilePage
