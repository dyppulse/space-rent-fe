import { useState, useCallback } from 'react'
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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FilterListIcon from '@mui/icons-material/FilterList'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import SpaceGrid from '../components/SpaceGrid'
import SpacesList from '../components/SpacesList'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSpaces } from '../api/queries/spaceQueries'
import ListSkeleton from '../components/ui/skeletons/ListSkeleton'

function SpacesPage() {
  const [searchParams] = useSearchParams()
  const urlSearchTerm = searchParams.get('search') || ''

  const [viewMode, setViewMode] = useState('grid')
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm)
  const [spaceType, setSpaceType] = useState('all')
  const [sort, setSort] = useState('recommended')
  const [capacity, setCapacity] = useState('any')
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showDetailedFilters, setShowDetailedFilters] = useState(true)

  // Update search term when URL parameter changes
  useEffect(() => {
    setSearchTerm(urlSearchTerm)
  }, [urlSearchTerm])

  const { data: spacesData, isLoading: loading } = useSpaces({
    search: searchTerm,
    spaceType,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort,
    capacity,
  })

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const handleDateFilter = () => {
    setShowDatePicker(true)
  }

  const handleLocationFilter = () => {
    setShowLocationPicker(true)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setShowDatePicker(false)
  }

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
    setShowLocationPicker(false)
  }

  const toggleDetailedFilters = () => {
    setShowDetailedFilters(!showDetailedFilters)
  }

  const resetFilters = () => {
    // Clear search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    setSearchTerm('')
    setSpaceType('all')
    setPriceRange([0, 1000000000])
    setSort('recommended')
    setCapacity('any')
    setSelectedDate(null)
    setSelectedLocation('')
    setShowDetailedFilters(true) // Show filters after reset
  }

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const handleSpaceTypeChange = (event) => {
    const newSpaceType = event.target.value
    setSpaceType(newSpaceType)
  }

  const handleSearchTermChange = (event) => {
    const newSearchTerm = event.target.value.trim()
    setSearchTerm(newSearchTerm)

    // Trigger debounced search
    debouncedSearch(newSearchTerm)
  }

  const handleSortByChange = (event) => {
    const newSort = event.target.value
    setSort(newSort)
  }

  const handleCapacityChange = (event) => {
    const newCapacity = event.target.value
    setCapacity(newCapacity)
  }

  // Debounced search function
  const debouncedSearch = useCallback((searchValue) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      if (searchValue) {
        setIsSearching(true)
      }
      // React Query handles the data fetching automatically
      setIsSearching(false)
    }, 800) // 800ms debounce delay for search
  }, [])

  // React Query handles data fetching automatically based on the filters passed to useSpaces hook

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Explore Spaces
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by location, venue type, name, or amenities..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleSearchTermChange}
            helperText={
              searchTerm &&
              (isSearching
                ? `Searching for: "${searchTerm}"...`
                : searchTimeoutRef.current
                  ? `Searching for: "${searchTerm}" (debounced...)`
                  : `Searching for: "${searchTerm}"`)
            }
            sx={{ mb: 2 }}
          />

          {/* Search Tips */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            💡 <strong>Search examples:</strong> "Kampala" (city), "wedding venue" (type), "parking"
            (amenity), "conference room" (space type)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              onClick={handleLocationFilter}
              sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            >
              Location {selectedLocation && `(${selectedLocation})`}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              onClick={handleDateFilter}
              sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            >
              Date {selectedDate && `(${selectedDate.toLocaleDateString()})`}
            </Button>
            <Button
              variant={showDetailedFilters ? 'contained' : 'outlined'}
              startIcon={<FilterListIcon />}
              onClick={toggleDetailedFilters}
              sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            >
              {showDetailedFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetFilters}
              sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            >
              Reset Filters
            </Button>
          </Box>
        </Box>

        {/* Detailed Filters Section */}
        {showDetailedFilters && (
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="space-type-label">Space Type</InputLabel>
                <Select
                  labelId="space-type-label"
                  id="space-type"
                  value={spaceType}
                  label="Space Type"
                  onChange={handleSpaceTypeChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="event-venue">Event Venue</MenuItem>
                  <MenuItem value="wedding-venue">Wedding Venue</MenuItem>
                  <MenuItem value="conference-room">Conference Room</MenuItem>
                  <MenuItem value="studio">Studio</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="capacity-label">Capacity</InputLabel>
                <Select
                  labelId="capacity-label"
                  id="capacity"
                  value={capacity}
                  label="Capacity"
                  onChange={handleCapacityChange}
                >
                  <MenuItem value="any">Any Size</MenuItem>
                  <MenuItem value="small">Small (1-20)</MenuItem>
                  <MenuItem value="medium">Medium (21-50)</MenuItem>
                  <MenuItem value="large">Large (51-100)</MenuItem>
                  <MenuItem value="xl">Extra Large (100+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography id="price-range-slider" gutterBottom>
                Price Range
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000000000} // we can get the max from all bookings, an additional endpoint can do this
                  step={50}
                  aria-labelledby="price-range-slider"
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    UGX {priceRange[0].toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    UGX {priceRange[1].toLocaleString()}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Current: UGX {priceRange[0].toLocaleString()} - UGX{' '}
                  {priceRange[1].toLocaleString()}
                </Typography>
              </Box>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={sort}
                  label="Sort By"
                  onChange={handleSortByChange}
                >
                  <MenuItem value="recommended">Recommended</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Results */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6">{spacesData?.spaces?.length} spaces available</Typography>
          {/* Filter Summary */}
          {(searchTerm ||
            spaceType !== 'all' ||
            capacity !== 'any' ||
            sort !== 'recommended' ||
            priceRange[0] > 0 ||
            priceRange[1] < 1000000000) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Filters: {searchTerm && `"${searchTerm}" `}
              {spaceType !== 'all' && `${spaceType} `}
              {capacity !== 'any' && `${capacity} `}
              {sort !== 'recommended' && `${sort} `}
              {(priceRange[0] > 0 || priceRange[1] < 1000000000) &&
                `UGX ${priceRange[0].toLocaleString()}-${priceRange[1].toLocaleString()}`}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            View:
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {loading ? (
        <ListSkeleton items={9} />
      ) : viewMode === 'grid' ? (
        <SpaceGrid spaces={spacesData?.spaces || []} />
      ) : (
        <SpacesList spaces={spacesData?.spaces || []} />
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowDatePicker(false)}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 2,
              minWidth: 300,
              border: '1px solid',
              borderColor: 'divider',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" gutterBottom>
              Select Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'divider',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '1px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                },
              }}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setSelectedDate(null)
                  setShowDatePicker(false)
                }}
                color="secondary"
              >
                Clear
              </Button>
              <Button onClick={() => setShowDatePicker(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => setShowDatePicker(false)}>
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowLocationPicker(false)}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 2,
              minWidth: 300,
              border: '1px solid',
              borderColor: 'divider',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" gutterBottom>
              Select Location
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="location-select-label">Choose Location</InputLabel>
              <Select
                labelId="location-select-label"
                id="location-select"
                value={selectedLocation}
                label="Choose Location"
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="Kampala">Kampala</MenuItem>
                <MenuItem value="Entebbe">Entebbe</MenuItem>
                <MenuItem value="Jinja">Jinja</MenuItem>
                <MenuItem value="Mbarara">Mbarara</MenuItem>
                <MenuItem value="Gulu">Gulu</MenuItem>
                <MenuItem value="Arua">Arua</MenuItem>
                <MenuItem value="Mbale">Mbale</MenuItem>
                <MenuItem value="Soroti">Soroti</MenuItem>
                <MenuItem value="Lira">Lira</MenuItem>
                <MenuItem value="Tororo">Tororo</MenuItem>
                <MenuItem value="Kabale">Kabale</MenuItem>
                <MenuItem value="Fort Portal">Fort Portal</MenuItem>
                <MenuItem value="Masaka">Masaka</MenuItem>
                <MenuItem value="Mukono">Mukono</MenuItem>
                <MenuItem value="Wakiso">Wakiso</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setSelectedLocation('')
                  setShowLocationPicker(false)
                }}
                color="secondary"
              >
                Clear
              </Button>
              <Button onClick={() => setShowLocationPicker(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => handleLocationChange(selectedLocation)}>
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default SpacesPage
