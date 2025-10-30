import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Paper,
  ClickAwayListener,
  Popper,
  Fade,
  Divider,
  IconButton,
  Stack,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteSpaces } from '../api/queries/spaceQueries'
import ListSkeleton from '../components/ui/skeletons/ListSkeleton'
import { CircularProgress } from '@mui/material'
import SpaceGrid from '../components/SpaceGrid'

// Format price for display
const formatPrice = (price) => {
  if (price >= 1000000) {
    return `UGX ${(price / 1000000).toFixed(1)}M`
  }
  if (price >= 1000) {
    return `UGX ${(price / 1000).toFixed(0)}K`
  }
  return `UGX ${price}`
}

function SpacesPage() {
  const [searchParams] = useSearchParams()
  const urlSearchTerm = searchParams.get('search') || ''

  // Filter states
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm)
  const [location, setLocation] = useState('')
  const [spaceType, setSpaceType] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [capacity, setCapacity] = useState('any')
  const [sort, setSort] = useState('recommended')
  const [_guests, setGuests] = useState(1)

  // UI states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [locationAnchor, setLocationAnchor] = useState(null)
  const [capacityAnchor, setCapacityAnchor] = useState(null)
  const [priceAnchor, setPriceAnchor] = useState(null)
  const [dateAnchor, setDateAnchor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')

  const searchTimeoutRef = useRef(null)

  // Update search term when URL parameter changes
  useEffect(() => {
    setSearchTerm(urlSearchTerm)
  }, [urlSearchTerm])

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

  // Debounced search
  const debouncedSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      // Search is handled by React Query automatically
    }, 300)
  }, [])

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm) count++
    if (location) count++
    if (spaceType !== 'all') count++
    if (priceRange[0] > 0 || priceRange[1] < 10000000) count++
    if (capacity !== 'any') count++
    if (selectedDate && selectedDate !== '') count++
    if (sort !== 'recommended') count++
    return count
  }, [searchTerm, location, spaceType, priceRange, capacity, selectedDate, sort])

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('')
    setLocation('')
    setSpaceType('all')
    setPriceRange([0, 10000000])
    setCapacity('any')
    setSort('recommended')
    setSelectedDate('')
    setGuests(1)
  }

  // Remove specific filter
  const removeFilter = (filterType) => {
    switch (filterType) {
      case 'search':
        setSearchTerm('')
        break
      case 'location':
        setLocation('')
        break
      case 'spaceType':
        setSpaceType('all')
        break
      case 'price':
        setPriceRange([0, 10000000])
        break
      case 'capacity':
        setCapacity('any')
        break
      case 'date':
        setSelectedDate('')
        break
      case 'sort':
        setSort('recommended')
        break
    }
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

  // Capacity options
  const capacityOptions = [
    { value: 'any', label: 'Any size' },
    { value: 'small', label: 'Small (1-20)' },
    { value: 'medium', label: 'Medium (21-50)' },
    { value: 'large', label: 'Large (51-100)' },
    { value: 'xl', label: 'Extra Large (100+)' },
  ]

  // Space type options
  const spaceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'event-venue', label: 'Event Venue' },
    { value: 'wedding-venue', label: 'Wedding Venue' },
    { value: 'conference-room', label: 'Conference Room' },
    { value: 'studio', label: 'Studio' },
  ]

  // Sort options
  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
  ]

  return (
    <Box sx={{ pb: 6 }}>
      {/* Sticky Search Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
          mb: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Container maxWidth="lg">
          {/* Main Search Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              },
            }}
          >
            {/* Search Input */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
              <TextField
                placeholder="Search spaces..."
                variant="standard"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '0.95rem',
                  },
                }}
                sx={{ flex: 1 }}
              />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Location Filter */}
            <ClickAwayListener onClickAway={() => setLocationAnchor(null)}>
              <Box>
                <Button
                  variant="text"
                  startIcon={<LocationOnIcon />}
                  onClick={(e) => setLocationAnchor(locationAnchor ? null : e.currentTarget)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    color: location ? 'primary.main' : 'text.primary',
                    fontWeight: location ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {location || 'Anywhere'}
                </Button>
                <Popper
                  open={Boolean(locationAnchor)}
                  anchorEl={locationAnchor}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper
                        elevation={8}
                        sx={{
                          mt: 1,
                          minWidth: 250,
                          maxHeight: 300,
                          overflow: 'auto',
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ p: 1 }}>
                          {locations.map((loc) => (
                            <MenuItem
                              key={loc}
                              selected={location === loc}
                              onClick={() => {
                                setLocation(location === loc ? '' : loc)
                                setLocationAnchor(null)
                              }}
                              sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                  bgcolor: 'primary.main',
                                  color: 'primary.contrastText',
                                  '&:hover': {
                                    bgcolor: 'primary.dark',
                                  },
                                },
                              }}
                            >
                              {loc}
                            </MenuItem>
                          ))}
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Date Filter */}
            <ClickAwayListener onClickAway={() => setDateAnchor(null)}>
              <Box>
                <Button
                  variant="text"
                  startIcon={<CalendarTodayIcon />}
                  onClick={(e) => setDateAnchor(dateAnchor ? null : e.currentTarget)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    color: selectedDate ? 'primary.main' : 'text.primary',
                    fontWeight: selectedDate ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Any date'}
                </Button>
                <Popper
                  open={Boolean(dateAnchor)}
                  anchorEl={dateAnchor}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper elevation={8} sx={{ mt: 1, p: 2, borderRadius: 2 }}>
                        <TextField
                          type="date"
                          label="Select Date"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value)
                            setDateAnchor(null)
                          }}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                        {selectedDate && (
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedDate('')
                              setDateAnchor(null)
                            }}
                            sx={{ mt: 1 }}
                          >
                            Clear
                          </Button>
                        )}
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Capacity/Guest Filter */}
            <ClickAwayListener onClickAway={() => setCapacityAnchor(null)}>
              <Box>
                <Button
                  variant="text"
                  startIcon={<PeopleIcon />}
                  onClick={(e) => setCapacityAnchor(capacityAnchor ? null : e.currentTarget)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    color: capacity !== 'any' ? 'primary.main' : 'text.primary',
                    fontWeight: capacity !== 'any' ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {capacityOptions.find((opt) => opt.value === capacity)?.label || 'Any size'}
                </Button>
                <Popper
                  open={Boolean(capacityAnchor)}
                  anchorEl={capacityAnchor}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper
                        elevation={8}
                        sx={{
                          mt: 1,
                          minWidth: 220,
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ p: 1 }}>
                          {capacityOptions.map((opt) => (
                            <MenuItem
                              key={opt.value}
                              selected={capacity === opt.value}
                              onClick={() => {
                                setCapacity(opt.value)
                                setCapacityAnchor(null)
                              }}
                              sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                  bgcolor: 'primary.main',
                                  color: 'primary.contrastText',
                                  '&:hover': {
                                    bgcolor: 'primary.dark',
                                  },
                                },
                              }}
                            >
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Price Filter */}
            <ClickAwayListener onClickAway={() => setPriceAnchor(null)}>
              <Box>
                <Button
                  variant="text"
                  startIcon={<AttachMoneyIcon />}
                  onClick={(e) => setPriceAnchor(priceAnchor ? null : e.currentTarget)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    color:
                      priceRange[0] > 0 || priceRange[1] < 10000000
                        ? 'primary.main'
                        : 'text.primary',
                    fontWeight: priceRange[0] > 0 || priceRange[1] < 10000000 ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {priceRange[0] > 0 || priceRange[1] < 10000000
                    ? `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`
                    : 'Any price'}
                </Button>
                <Popper
                  open={Boolean(priceAnchor)}
                  anchorEl={priceAnchor}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper elevation={8} sx={{ mt: 1, p: 3, minWidth: 320, borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Price Range
                        </Typography>
                        <Box sx={{ px: 2, py: 3 }}>
                          <Slider
                            value={priceRange}
                            onChange={(e, newValue) => setPriceRange(newValue)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => formatPrice(value)}
                            min={0}
                            max={10000000}
                            step={50000}
                            sx={{
                              '& .MuiSlider-thumb': {
                                width: 20,
                                height: 20,
                              },
                              '& .MuiSlider-track': {
                                height: 6,
                              },
                              '& .MuiSlider-rail': {
                                height: 6,
                              },
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'space-between',
                          }}
                        >
                          <TextField
                            label="Min"
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) =>
                              setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                            }
                            size="small"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                            }}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Max"
                            type="number"
                            value={priceRange[1] === 10000000 ? '' : priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([priceRange[0], Number(e.target.value) || 10000000])
                            }
                            size="small"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                            }}
                            sx={{ flex: 1 }}
                          />
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>

            {/* Advanced Filters Toggle */}
            <Button
              variant={showAdvancedFilters ? 'contained' : 'outlined'}
              startIcon={<TuneIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                minWidth: 'auto',
              }}
            >
              {showAdvancedFilters ? 'Hide' : 'Filters'}
              {activeFiltersCount > 0 && (
                <Chip
                  label={activeFiltersCount}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: '0.7rem',
                    bgcolor: showAdvancedFilters ? 'rgba(255,255,255,0.2)' : 'primary.main',
                    color: showAdvancedFilters ? 'inherit' : 'primary.contrastText',
                  }}
                />
              )}
            </Button>
          </Paper>

          {/* Active Filters Chips */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Active filters:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => removeFilter('search')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {location && (
                <Chip
                  label={`Location: ${location}`}
                  onDelete={() => removeFilter('location')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {spaceType !== 'all' && (
                <Chip
                  label={`Type: ${
                    spaceTypes.find((t) => t.value === spaceType)?.label || spaceType
                  }`}
                  onDelete={() => removeFilter('spaceType')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
                <Chip
                  label={`Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                  onDelete={() => removeFilter('price')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {capacity !== 'any' && (
                <Chip
                  label={`Capacity: ${
                    capacityOptions.find((c) => c.value === capacity)?.label || capacity
                  }`}
                  onDelete={() => removeFilter('capacity')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedDate && (
                <Chip
                  label={`Date: ${new Date(selectedDate).toLocaleDateString()}`}
                  onDelete={() => removeFilter('date')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {sort !== 'recommended' && (
                <Chip
                  label={`Sort: ${sortOptions.find((s) => s.value === sort)?.label || sort}`}
                  onDelete={() => removeFilter('sort')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              <Button
                size="small"
                onClick={clearAllFilters}
                sx={{ textTransform: 'none', ml: 'auto' }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Space Type</InputLabel>
                  <Select
                    value={spaceType}
                    label="Space Type"
                    onChange={(e) => setSpaceType(e.target.value)}
                  >
                    {spaceTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        )}

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
