import { useState } from 'react'
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
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HomeIcon from '@mui/icons-material/Home'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SettingsIcon from '@mui/icons-material/Settings'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
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
  const { isAuthenticated } = useAuth()

  const { data: userSpaces, isLoading: spacesLoading } = useMySpaces(isAuthenticated)
  const { data: userBookings, isLoading: bookingsLoading } = useOwnerBookings(isAuthenticated)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

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
              <Typography variant="caption" color="text.secondary">
                {userBookings?.filter((b) => b.status === 'pending')?.length || 0} pending requests
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
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Clients" id="dashboard-tab-2" />
            <Tab
              icon={<SettingsIcon />}
              iconPosition="start"
              label="Settings"
              id="dashboard-tab-3"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {userSpaces?.length > 0 ? (
            <SpacesList spaces={userSpaces || []} />
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
          {userBookings?.length > 0 ? (
            <BookingsList bookings={userBookings} spaces={userSpaces} />
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No bookings yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You don't have any bookings for your spaces yet.
              </Typography>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Client Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage your clients.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              Client management features will be available in the next update.
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account settings and preferences.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              Account settings will be available in the next update.
            </Typography>
          </Paper>
        </TabPanel>
      </Box>
    </Container>
  )
}

export default DashboardPage
