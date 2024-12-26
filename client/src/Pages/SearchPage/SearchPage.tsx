import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SearchResult {
  id: string
  name: string
  description: string
  industry: string
  location: string
}

const SearchPage: React.FC = () => {
  const location = useLocation()
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState({
    industry: '',
    location: ''
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const query = searchParams.get('q') || ''
    // Implement actual search logic here
    setSearchResults([
      {
        id: '1',
        name: 'TechCorp',
        description: 'Innovative tech solutions',
        industry: 'SaaS',
        location: 'San Francisco'
      },
      {
        id: '2',
        name: 'GreenEnergy',
        description: 'Sustainable energy solutions',
        industry: 'CleanTech',
        location: 'Berlin'
      }
    ])
  }, [location])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const filteredResults = searchResults.filter(
    result =>
      (!filters.industry || result.industry === filters.industry) &&
      (!filters.location || result.location === filters.location)
  )

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Search Results</h1>
      <div className='mb-4 flex space-x-4'>
        <select
          name='industry'
          value={filters.industry}
          onChange={handleFilterChange}
          className='p-2 border rounded'
        >
          <option value=''>All Industries</option>
          <option value='SaaS'>SaaS</option>
          <option value='CleanTech'>CleanTech</option>
        </select>
        <select
          name='location'
          value={filters.location}
          onChange={handleFilterChange}
          className='p-2 border rounded'
        >
          <option value=''>All Locations</option>
          <option value='San Francisco'>San Francisco</option>
          <option value='Berlin'>Berlin</option>
        </select>
      </div>
      <div className='space-y-4'>
        {filteredResults.map(result => (
          <div key={result.id} className='bg-white rounded-lg shadow p-4'>
            <h2 className='text-xl font-semibold'>{result.name}</h2>
            <p className='text-gray-600'>{result.description}</p>
            <div className='mt-2'>
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2'>
                {result.industry}
              </span>
              <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm'>
                {result.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPage
