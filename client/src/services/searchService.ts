import api from '../lib/axios'

export interface SearchResult {
  _id: string
  title: string
  subtitle: string
  image?: string
  type: 'user' | 'startup'
}

const searchService = {
  quickSearch: async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return []
    
    try {
      const response = await api.get(`/api/search/quick?query=${encodeURIComponent(query)}`)
      return response.data.results || []
    } catch (error) {
      console.error('Quick search error:', error)
      return []
    }
  },

  search: async (query: string) => {
    if (!query.trim()) return { users: [], startups: [] }
    
    try {
      const response = await api.get(`/api/search?query=${encodeURIComponent(query)}`)
      return {
        users: response.data.users || [],
        startups: response.data.startups || []
      }
    } catch (error) {
      console.error('Search error:', error)
      return { users: [], startups: [] }
    }
  }
}

export default searchService 