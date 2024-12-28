import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, Building2, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import searchService, { SearchResult } from '@/services/searchService'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/Components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/Components/ui/popover'
import { Button } from '@/Components/ui/button'

const SearchBar = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()
        setLoading(true)

        const data = await searchService.quickSearch(debouncedQuery)
        setResults(data || [])
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Search error:', error)
          setResults([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchResults()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedQuery])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    setResults([])
    
    if (result.type === 'user') {
      navigate(`/profile/${result._id}`)
    } else {
      navigate(`/startup/${result._id}`)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild ref={triggerRef}>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[300px] justify-between'
        >
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Search className='w-4 h-4' />
            {query || 'Search users and startups...'}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Search users and startups...'
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className='flex items-center justify-center gap-2 py-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Searching...
                </div>
              ) : query.length > 0 ? (
                'No results found.'
              ) : (
                'Start typing to search...'
              )}
            </CommandEmpty>
            {results.length > 0 && !loading && (
              <CommandGroup>
                {results.map(result => (
                  <CommandItem
                    key={`${result.type}-${result._id}`}
                    onSelect={() => handleSelect(result)}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    {result.type === 'user' ? (
                      <User className='w-4 h-4' />
                    ) : (
                      <Building2 className='w-4 h-4' />
                    )}
                    <div className='flex flex-col'>
                      <span className='font-medium'>{result.title}</span>
                      <span className='text-sm text-muted-foreground'>
                        {result.subtitle}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchBar 