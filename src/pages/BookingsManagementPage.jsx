import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import BookingsTable from '../components/booking/BookingsTable'
import BookingActionsModal from '../components/booking/BookingActionsModal'
import { useBookings } from '../api/queries/bookingQueries'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'

function BookingsManagementPage() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [actionType, setActionType] = useState('') // 'accept', 'decline', 'view'

  // Fetch bookings data
  const { data: bookings, isLoading, error } = useBookings()

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const handleBookingAction = (booking, action) => {
    setSelectedBooking(booking)
    setActionType(action)
    setShowActionsModal(true)
  }

  const handleCloseActionsModal = () => {
    setShowActionsModal(false)
    setSelectedBooking(null)
    setActionType('')
  }

  const handleActionSuccess = () => {
    // Data will automatically refresh due to React Query invalidation
    handleCloseActionsModal()
  }

  const getFilteredBookings = () => {
    if (!bookings) return []

    switch (selectedTab) {
      case 0: // All Bookings
        return bookings
      case 1: // Pending
        return bookings.filter((booking) => booking.status === 'pending')
      case 2: // Confirmed
        return bookings.filter((booking) => booking.status === 'confirmed')
      case 3: // Declined
        return bookings.filter((booking) => booking.status === 'declined')
      case 4: // Completed
        return bookings.filter((booking) => booking.status === 'completed')
      default:
        return bookings
    }
  }

  const getBookingCounts = () => {
    if (!bookings) return { all: 0, pending: 0, confirmed: 0, declined: 0, completed: 0 }

    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      declined: bookings.filter((b) => b.status === 'declined').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
    }
  }

  const counts = getBookingCounts()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
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
    <Box sx={{ mt: 2, mx: 2 }}>
      <Container maxWidth="xl" sx={{ py: 6, px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Bookings Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/spaces')}
              sx={{ px: 3 }}
            >
              Book New Space
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage all your space bookings, view details, and track status updates.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {counts.all}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Bookings
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
              {counts.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {counts.confirmed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirmed
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              {counts.declined}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Declined
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
              {counts.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Stack>

        {/* Main Content */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    All Bookings
                    <Chip label={counts.all} size="small" color="default" />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Pending
                    <Chip label={counts.pending} size="small" color="warning" />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Confirmed
                    <Chip label={counts.confirmed} size="small" color="success" />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Declined
                    <Chip label={counts.declined} size="small" color="error" />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Completed
                    <Chip label={counts.completed} size="small" color="info" />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Bookings Table */}
          <Box sx={{ p: 3 }}>
            <BookingsTable
              bookings={getFilteredBookings()}
              onBookingAction={handleBookingAction}
              isLoading={isLoading}
            />
          </Box>
        </Paper>

        {/* Actions Modal */}
        <BookingActionsModal
          open={showActionsModal}
          onClose={handleCloseActionsModal}
          booking={selectedBooking}
          actionType={actionType}
          onSuccess={handleActionSuccess}
        />
      </Container>
    </Box>
  )
}

export default BookingsManagementPage
