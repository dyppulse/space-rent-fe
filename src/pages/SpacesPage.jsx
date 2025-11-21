import { useState, useEffect, useRef, useMemo } from 'react'
import { Box, Container, Typography, CircularProgress } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteSpaces } from '../api/queries/spaceQueries'
import ListSkeleton from '../components/ui/skeletons/ListSkeleton'
import SpaceGrid from '../components/SpaceGrid'
import FilterHeader from '../components/FilterHeader'

const SEARCH_DEBOUNCE_MS = 500

function SpacesPage() {
  const [searchParams] = useSearchParams()
  const urlSearchTerm = searchParams.get('search') || ''

  // Filter states
  const [searchInput, setSearchInput] = useState(urlSearchTerm)
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm)
  const [location, setLocation] = useState('')
  const [spaceType, setSpaceType] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000000])

  const [capacity, _setCapacity] = useState('any')

  const [sort, _setSort] = useState('recommended')
  // eslint-disable-next-line no-unused-vars
  const [selectedDate, _setSelectedDate] = useState('')

  // Update search term when URL parameter changes
  useEffect(() => {
    setSearchInput(urlSearchTerm)
    setSearchTerm(urlSearchTerm)
  }, [urlSearchTerm])

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handler)
  }, [searchInput])

  // Build filters object
  const filters = useMemo(
    () => ({
      search: searchTerm || undefined,
      spaceType: spaceType !== 'all' ? spaceType : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 10000000 ? priceRange[1] : undefined,
      sort,
      capacity: capacity !== 'any' ? capacity : undefined,
      city: location || undefined,
    }),
    [searchTerm, spaceType, priceRange, sort, capacity, location]
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteSpaces(
    filters,
    12
  )

  // Flatten pages into single array
  const spacesData = data?.pages
    ? {
        spaces: data.pages.flatMap((page) => page.spaces || []),
        totalSpaces: data.pages[0]?.totalSpaces || 0,
      }
    : { spaces: [], totalSpaces: 0 }

  // Infinite scroll handler
  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value)
  }

  // Location options
  const locations = [
    'Kampala',
    'Entebbe',
    'Jinja',
    'Mbarara',
    'Gulu',
    'Arua',
    'Mbale',
    'Soroti',
    'Lira',
    'Tororo',
    'Kabale',
    'Fort Portal',
    'Masaka',
    'Mukono',
    'Wakiso',
  ]

  // Space type options
  const spaceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'event-venue', label: 'Event Venue' },
    { value: 'wedding-venue', label: 'Wedding Venue' },
    { value: 'conference-room', label: 'Conference Room' },
    { value: 'studio', label: 'Studio' },
  ]

  return (
    <Box sx={{ pb: 6 }}>
      {/* Integrated Filter Header */}
      <FilterHeader
        searchTerm={searchInput}
        onSearchChange={handleSearchChange}
        spaceType={spaceType}
        onSpaceTypeChange={setSpaceType}
        location={location}
        onLocationChange={setLocation}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        spaceTypes={spaceTypes}
        locations={locations}
      />

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {/* Results Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {spacesData?.totalSpaces || 0} spaces available
          </Typography>
        </Box>

        {/* Results Grid */}
        {isLoading ? (
          <ListSkeleton items={12} />
        ) : (
          <>
            <SpaceGrid spaces={spacesData?.spaces || []} />

            {/* Infinite scroll trigger */}
            <Box
              ref={observerTarget}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4,
                minHeight: 100,
              }}
            >
              {isFetchingNextPage && <CircularProgress size={40} />}
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
}

export default SpacesPage
