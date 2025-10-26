import { useState, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import { format } from 'date-fns'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Link } from 'react-router-dom'
import { useUserBookings } from '../api/queries/bookingQueries'
import { useAuth } from '../contexts/AuthContext'

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'declined':
      return 'error'
    case 'cancelled':
      return 'error'
    case 'completed':
      return 'info'
    default:
      return 'default'
  }
}

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function ClientDashboardPage() {
  const [tabValue, setTabValue] = useState(0)
  const { user } = useAuth()
  const { data: bookings, isLoading, error } = useUserBookings()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Filter bookings based on selected tab
  const filteredBookings = useMemo(() => {
    if (!bookings) return []

    switch (tabValue) {
      case 0: // All
        return bookings
      case 1: // Pending
        return bookings.filter((b) => b.status === 'pending')
      case 2: // Confirmed
        return bookings.filter((b) => b.status === 'confirmed')
      case 3: // Completed
        return bookings.filter((b) => b.status === 'completed')
      case 4: // Declined
        return bookings.filter((b) => b.status === 'declined')
      default:
        return bookings
    }
  }, [bookings, tabValue])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!bookings) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        declined: 0,
        totalSpent: 0,
      }
    }

    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      declined: bookings.filter((b) => b.status === 'declined').length,
      totalSpent: bookings
        .filter((b) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    }
  }, [bookings])

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error loading bookings: {error?.message || 'Unknown error'}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Manage your bookings and track your history.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {stats.total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Bookings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
              {stats.pending}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {stats.confirmed}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Confirmed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
              {stats.completed}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              {stats.declined}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Declined
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              UGX {stats.totalSpent.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Spent
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Bookings Section */}
      <Paper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Confirmed" />
            <Tab label="Completed" />
            <Tab label="Declined" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {filteredBookings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0
                  ? "You haven't made any bookings yet."
                  : `You don't have any ${getStatusLabel(['All', 'Pending', 'Confirmed', 'Completed', 'Declined'][tabValue]).toLowerCase()} bookings.`}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                component={Link}
                to="/spaces"
              >
                Browse Spaces
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Venue</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Guests</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {booking.space?.images?.[0] ? (
                            <Avatar
                              src={booking.space.images[0]}
                              alt={booking.space?.name}
                              sx={{ width: 40, height: 40 }}
                            />
                          ) : (
                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                              {booking.space?.name?.charAt(0)}
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {booking.space?.name || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.space?.location?.address || ''}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(booking.eventDate), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(booking.startTime), 'hh:mm a')} -{' '}
                          {format(new Date(booking.endTime), 'hh:mm a')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {booking.attendees || booking.guests || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          UGX {booking.totalPrice?.toLocaleString() || '0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(booking.status)}
                          size="small"
                          color={getStatusColor(booking.status)}
                          sx={{
                            fontWeight: 'medium',
                            ...(booking.status === 'pending' && {
                              bgcolor: 'rgba(255, 167, 38, 0.1)',
                              color: 'warning.dark',
                            }),
                            ...(booking.status === 'confirmed' && {
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              color: 'success.dark',
                            }),
                            ...(booking.status === 'declined' && {
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                              color: 'error.dark',
                            }),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          component={Link}
                          to={`/bookings/${booking.id}`}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default ClientDashboardPage
