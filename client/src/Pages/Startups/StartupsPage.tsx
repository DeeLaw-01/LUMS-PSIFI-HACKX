import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users2, Briefcase, DollarSign } from 'lucide-react'
import startupService from '@/services/startupService'
import { Skeleton } from '@/Components/ui/skeleton'

interface Startup {
  _id: string
  displayName: string
  description: string
  logo: string
  industry: string
  fundraised: number
  timelineStatus: string
  team: Array<{
    user: {
      _id: string
      username: string
      profilePicture?: string
    }
    role: string
    position: string
  }>
}

const StartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await startupService.getAllStartups()
        setStartups(response)
      } catch (error) {
        console.error('Error fetching startups:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])

  const handleStartupClick = (startupId: string) => {
    navigate(`/startup/${startupId}`)
  }

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case 'SERVICE_BASED':
        return 'bg-blue-500'
      case 'PRODUCT_BASED':
        return 'bg-green-500'
      case 'HYBRID':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatFundraised = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg p-6 space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24 h-screen">
      <h1 className="text-4xl font-bold mb-8">Explore Startups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <div
            key={startup._id}
            onClick={() => handleStartupClick(startup._id)}
            className="bg-card border border-border hover:border-primary/50 rounded-lg p-6 space-y-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Building2 className="w-12 h-12 text-muted-foreground" />
              )}
              <div>
                <h2 className="text-xl font-semibold">{startup.displayName}</h2>
                <span
                  className={`${getIndustryColor(
                    startup.industry
                  )} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {startup.industry.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground line-clamp-2">
              {startup.description}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users2 className="w-4 h-4" />
                <span>{startup.team.length} members</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>{formatFundraised(startup.fundraised)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>{startup.timelineStatus.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StartupsPage 