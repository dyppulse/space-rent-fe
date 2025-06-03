import { useState } from 'react'
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
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchSpaces } from '../redux/slices/spaceSlice'
import { useSelector } from 'react-redux'

function SpacesPage() {
  const [viewMode, setViewMode] = useState('grid')
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [searchTerm, setSearchTerm] = useState('')
  const [spaceType, setSpaceType] = useState('all')
  const [sort, setSort] = useState('recommended')
  const [capacity, setCapacity] = useState('any')

  const dispatch = useDispatch()
  const { list } = useSelector((state) => state.spaces)

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const handleSpaceTypeChange = (event) => {
    setSpaceType(event.target.value)
  }

  const handleSearchTermChange = (event) => {
    console.log(event.target.value, 'event.target.value')
    setSearchTerm(event.target.value)
  }

  const handleSortByChange = (event) => {
    setSort(event.target.value)
  }

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value)
  }

  // ✅ Immediate fetch on mount — no debounce
  useEffect(() => {
    dispatch(fetchSpaces())
  }, [dispatch])

  // ✅ Debounced fetch on filters
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(
        fetchSpaces({
          search: searchTerm,
          spaceType,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort,
          capacity,
        })
      )
    }, 500) // Debounce delay

    return () => clearTimeout(handler) // Cleanup timeout
  }, [searchTerm, spaceType, priceRange, sort, capacity, dispatch])

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
            placeholder="Search by location or venue type"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleSearchTermChange}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            >
              Location
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            >
              Date
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
            >
              Filters
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="space-type-label">Space Type</InputLabel>
              <Select
                labelId="space-type-label"
                id="space-type"
                value="all"
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
                value="any"
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
                  $0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  UGX 1,000,000,000
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value="recommended"
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
        <Typography variant="h6">{list?.spaces?.length} spaces available</Typography>
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

      <SpaceGrid spaces={list} />
    </Container>
  )
}

export default SpacesPage
