import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button, TextField, InputAdornment, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FilterListIcon from '@mui/icons-material/FilterList'
import SpaceGrid from '../components/SpaceGrid'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpaces } from '../redux/slices/spaceSlice'
import ListSkeleton from '../components/ui/skeletons/ListSkeleton'

function HomePage() {
  const dispatch = useDispatch()
  const { list, loading } = useSelector((state) => state.spaces)

  useEffect(() => {
    dispatch(fetchSpaces())
  }, [dispatch])
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={(theme) => ({
          position: 'relative',
          py: 10,
          color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(1000px 500px at 20% 0%, rgba(255,56,92,0.15), transparent 60%), linear-gradient(180deg, #0F0F10 0%, #151516 100%)'
              : 'radial-gradient(1000px 500px at 20% 0%, rgba(255,56,92,0.08), transparent 60%), linear-gradient(180deg, #FFF8FA 0%, #FFFFFF 100%)',
        })}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Find the perfect space for your next event
            </Typography>
            <Typography variant="h5" sx={{ mb: 5, opacity: 0.9 }}>
              Discover and book unique venues, studios, and meeting spaces without the hassle.
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              <TextField
                placeholder="Search by location or venue type"
                variant="outlined"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                size="medium"
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  px: 4,
                  height: { xs: 40, sm: 'auto' },
                  minWidth: { sm: 120 },
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 4,
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold">
              Available Spaces
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" startIcon={<LocationOnIcon />} size="medium">
                Location
              </Button>
              <Button variant="outlined" startIcon={<CalendarTodayIcon />} size="medium">
                Date
              </Button>
              <Button variant="outlined" startIcon={<FilterListIcon />} size="medium">
                Filters
              </Button>
            </Box>
          </Box>

          {/* Space Grid */}
          {loading ? (
            <ListSkeleton items={6} />
          ) : list?.spaces?.length ? (
            <SpaceGrid spaces={list.spaces} />
          ) : (
            <SpaceGrid spaces={[]} />
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Own a space? List it on our platform
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Join our community of space owners and start earning from your venue today.
          </Typography>
          <Button
            component={Link}
            to="/auth/signup"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            List Your Space
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
