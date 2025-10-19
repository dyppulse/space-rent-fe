import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Button, TextField, InputAdornment, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SpaceGrid from '../components/SpaceGrid'

import { useSpaces } from '../api/queries/spaceQueries'
import { useAuth } from '../contexts/AuthContext'
import ListSkeleton from '../components/ui/skeletons/ListSkeleton'

// Background images array
const backgroundImages = [
  '/images/conference-center-lively.jpg',
  '/images/outdoor-party-space.jpg',
  '/images/outdoor-party-space-2.jpg',
  '/images/outdoor-party-space-3.jpg',
  '/images/outdoor-party-space-4.jpg',
  '/images/outdoor-party-space-5.jpg',
]

function HomePage() {
  const navigate = useNavigate()
  const { data: spacesData, isLoading: loading } = useSpaces()
  const { isLoading: authLoading } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Rotate background images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const handleListSpaceClick = () => {
    // Only wait if we're actively loading
    if (authLoading) {
      return
    }

    // Navigate to new space page - PrivateRoute will handle auth and redirects
    navigate('/dashboard/spaces/new')
  }
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={(theme) => ({
          position: 'relative',
          py: 10,
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          backgroundImage: `url("${backgroundImages[currentImageIndex]}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 1s ease-in-out',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
        })}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Find the perfect space for your next event
            </Typography>
            <Typography variant="h5" sx={{ mb: 5, opacity: 0.95, fontWeight: 400 }}>
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
          <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 4 }}>
            Available Spaces
          </Typography>

          {/* Space Grid */}
          {loading ? (
            <ListSkeleton items={6} />
          ) : spacesData?.spaces?.length ? (
            <SpaceGrid spaces={spacesData?.spaces || []} />
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
            onClick={handleListSpaceClick}
            variant="contained"
            color="primary"
            size="large"
            disabled={authLoading}
            sx={{ px: 4, py: 1.5 }}
          >
            {authLoading ? 'Loading...' : 'List Your Space'}
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
