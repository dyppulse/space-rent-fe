import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  CardContent,
  Tabs,
  Tab,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HomeIcon from '@mui/icons-material/Home'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SearchIcon from '@mui/icons-material/Search'
import SpacesList from '../components/SpacesList'
import BookingsList from '../components/BookingsList'

import { useMySpaces } from '../api/queries/spaceQueries'
import { useOwnerBookings } from '../api/queries/bookingQueries'
import { useAuth } from '../contexts/AuthContext'

import DashboardSkeleton from '../components/ui/skeletons/DashboardSkeleton'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function DashboardPage() {
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated } = useAuth()

  const { data: userSpaces, isLoading: spacesLoading } = useMySpaces(isAuthenticated)
  const { data: userBookings, isLoading: bookingsLoading } = useOwnerBookings(isAuthenticated)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Filter spaces based on search query
  const filteredSpaces = useMemo(() => {
    if (!searchQuery.trim() || !userSpaces) return userSpaces

    const query = searchQuery.toLowerCase().trim()

    return userSpaces.filter((space) => {
      // Search in space name
      if (space.name?.toLowerCase().includes(query)) return true

      // Search in space description
      if (space.description?.toLowerCase().includes(query)) return true

      // Search in location address
      if (space.location?.address?.toLowerCase().includes(query)) return true

      // Search in region
      if (space.location?.region?.toLowerCase().includes(query)) return true

      // Search in district
      if (space.location?.district?.toLowerCase().includes(query)) return true

      // Search in space types
      if (space.spaceTypes?.some((st) => st.name?.toLowerCase().includes(query))) return true
      if (space.spaceType?.name?.toLowerCase().includes(query)) return true
      if (space.spaceTypeName?.toLowerCase().includes(query)) return true

      // Search in amenities
      if (space.amenities?.some((amenity) => amenity?.toLowerCase().includes(query))) return true

      // Search in capacity
      if (space.capacity?.toString().includes(query)) return true

      // Search in price
      if (space.price?.amount?.toString().includes(query)) return true
      if (space.price?.unit?.toLowerCase().includes(query)) return true

      return false
    })
  }, [userSpaces, searchQuery])

  // Show loading state while data is being fetched
  if (spacesLoading || bookingsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <DashboardSkeleton />
      </Container>
    )
  }

  // Show loading if we don't have data yet (this handles the case where isLoading is false but data is still undefined)
  if (userSpaces === undefined || userBookings === undefined) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <DashboardSkeleton />
      </Container>
    )
  }

  // If we have data but it's empty arrays, show appropriate message instead of skeleton
  if (Array.isArray(userSpaces) && Array.isArray(userBookings)) {
    // Data has been fetched, show dashboard (even if empty)
    console.log('Data fetched successfully:', { userSpaces, userBookings })
  }

  // Show message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Please log in to view your dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You need to be authenticated to access this page.
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your spaces and bookings
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/dashboard/spaces/new"
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
        >
          Add New Space
        </Button>
      </Box>
      {/* <Grid
-  xs={12}
-  sm={6}
+  size={{ xs: 12, sm: 6 }}
 > */}
      {/* Dashboard Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Total Spaces
                </Typography>
                <HomeIcon color="action" fontSize="small" />
              </Box>
              <Typography variant="h4">{userSpaces?.length || 0}</Typography>
              <Typography variant="caption" color="text.secondary">
                {userSpaces?.length > 0 ? '+1 space this month' : 'Add your first space'}
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Upcoming Bookings
                </Typography>
                <CalendarTodayIcon color="action" fontSize="small" />
              </Box>
              <Typography variant="h4">
                {userBookings?.filter((b) => b.status === 'confirmed')?.length || 0}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {userBookings?.filter((b) => b.status === 'pending')?.length || 0} pending
                  requests
                </Typography>
                <Button
                  component={Link}
                  to="/dashboard/bookings"
                  variant="outlined"
                  size="small"
                  color="primary"
                >
                  Manage Bookings
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Total Revenue
                </Typography>
                <AttachMoneyIcon color="action" fontSize="small" />
              </Box>
              <Typography variant="h4">
                UGX
                {userBookings?.reduce((sum, booking) => sum + (booking?.totalPrice || 0), 0) || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                + UGX 1,200 from last month
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Dashboard Content */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<HomeIcon />} iconPosition="start" label="My Spaces" id="dashboard-tab-0" />
            <Tab
              icon={<CalendarTodayIcon />}
              iconPosition="start"
              label="Bookings"
              id="dashboard-tab-1"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {userSpaces?.length > 0 ? (
            <Box>
              {/* Search Input */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search spaces by name, location, type, amenities, capacity, price..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.paper',
                    },
                  }}
                />
              </Box>

              {/* Results info */}
              {searchQuery && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Found {filteredSpaces?.length || 0} space
                    {filteredSpaces?.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </Typography>
                </Box>
              )}

              {/* Spaces List */}
              {filteredSpaces?.length > 0 ? (
                <SpacesList spaces={filteredSpaces} />
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    No spaces found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    No spaces match your search criteria. Try adjusting your search.
                  </Typography>
                  {searchQuery && (
                    <Button variant="outlined" onClick={() => setSearchQuery('')} sx={{ mt: 1 }}>
                      Clear Search
                    </Button>
                  )}
                </Paper>
              )}
            </Box>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No spaces yet
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                You haven't added any spaces to your account yet. Get started by adding your first
                space.
              </Typography>
              <Button
                component={Link}
                to="/dashboard/spaces/new"
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
              >
                Add New Space
              </Button>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Bookings Management Card */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CalendarTodayIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Bookings Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage all your space bookings, accept/decline requests, and track status
                </Typography>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={2.4}>
                <Box
                  sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {userBookings?.filter((b) => b.status === 'pending')?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Box
                  sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {userBookings?.filter((b) => b.status === 'confirmed')?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Confirmed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Box
                  sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {userBookings?.filter((b) => b.status === 'completed')?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Box
                  sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    {userBookings?.filter((b) => b.status === 'declined')?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Declined
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Box
                  sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {userBookings?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/dashboard/bookings"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 3 }}
              >
                Manage All Bookings
              </Button>
              <Button
                component={Link}
                to="/dashboard/bookings?filter=pending"
                variant="outlined"
                color="warning"
                size="large"
                disabled={!userBookings?.filter((b) => b.status === 'pending')?.length}
              >
                Review Pending ({userBookings?.filter((b) => b.status === 'pending')?.length || 0})
              </Button>
            </Box>
          </Paper>
        </TabPanel>
      </Box>
    </Container>
  )
}

export default DashboardPage
