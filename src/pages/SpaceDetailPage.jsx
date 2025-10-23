import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, Chip, Tabs, Tab, Paper, Rating } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Button } from '@mui/material'
import { useSpace } from '../api/queries/spaceQueries'
import { useAuth } from '../contexts/AuthContext'
import DetailSkeleton from '../components/ui/skeletons/DetailSkeleton'
import ImageGallery from '../components/ImageGallery'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`space-tabpanel-${index}`}
      aria-labelledby={`space-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function SpaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)

  const { data: space, isLoading: loading } = useSpace(id)
  const { user } = useAuth()

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <DetailSkeleton />
      </Container>
    )
  }

  // If space not found, redirect to spaces page
  if (!loading && !space) {
    navigate('/spaces')
    return null
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* Left column - Space details */}
        <Grid item size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {space?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LocationOnIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body1" color="text.secondary">
              {space?.location?.address}
            </Typography>
          </Box>

          {/* Image gallery */}
          <Box sx={{ mb: 4 }}>
            <ImageGallery images={space?.images || []} name={space?.name} />
          </Box>

          {/* Tabs for details */}
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="space details tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Overview" id="space-tab-0" />
                <Tab label="Amenities" id="space-tab-1" />
                <Tab label="Location" id="space-tab-2" />
                <Tab label="Reviews" id="space-tab-3" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon color="action" sx={{ mr: 1 }} />
                    <Typography>Capacity: {space?.capacity} people</Typography>
                  </Box>
                  {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography>
                      ${space.price}/{space?.price?.unit}
                    </Typography>
                  </Box> */}
                  <Chip
                    label={
                      space?.spaceTypes?.length > 0
                        ? space.spaceTypes.map((st) => st.name).join(', ')
                        : space?.spaceType?.name || space?.spaceTypeName
                    }
                    color="primary"
                    sx={{
                      bgcolor: 'rgba(13, 148, 136, 0.1)',
                      color: 'primary.main',
                    }}
                  />
                </Box>

                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography paragraph>{space?.description}</Typography>

                <Typography variant="h6" gutterBottom>
                  Space Details
                </Typography>
                <Typography paragraph>
                  This{' '}
                  {space?.spaceTypes?.length > 0
                    ? space.spaceTypes.map((st) => st.name.toLowerCase()).join(' and ')
                    : space?.spaceType?.name?.toLowerCase()}{' '}
                  is available for bookings. Perfect for
                  {space?.spaceTypes?.length > 0
                    ? ' multiple types of events and activities'
                    : space?.spaceType?.name === 'Event Venue'
                      ? ' events, parties, and gatherings'
                      : space?.spaceType?.name === 'Conference Room'
                        ? ' meetings, workshops, and presentations'
                        : ' creative work, photoshoots, and productions'}
                  .
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                {space?.amenities?.map((amenity) => (
                  <Grid item key={amenity} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>{amenity}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography paragraph>
                Located in {space?.location?.address}. Detailed directions will be provided after
                booking.
              </Typography>
              <Box
                sx={{
                  height: 300,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">Map will be displayed here</Typography>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              {space?.rating ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="span" sx={{ mr: 2 }}>
                      {space?.rating}
                    </Typography>
                    <Rating value={space?.rating} precision={0.5} readOnly />
                  </Box>
                  <Typography color="text.secondary">Reviews will be displayed here.</Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">No reviews yet.</Typography>
              )}
            </TabPanel>
          </Box>
        </Grid>

        {/* Right column - Booking form */}
        {space?.owner !== user?.userId && (
          <Grid item size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: 'sticky' }, top: 88 }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Book this space
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Ready to book this amazing space? Click below to start the booking process.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(`/spaces/${space?.id}/book`)}
                  sx={{ py: 1.5 }}
                >
                  Start Booking Process
                </Button>
              </Paper>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default SpaceDetailPage
