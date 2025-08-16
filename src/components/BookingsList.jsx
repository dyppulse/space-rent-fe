import { useState } from 'react'
import { Box, Paper, Typography, Chip, Button, Divider, Snackbar, Alert } from '@mui/material'
import { format } from 'date-fns'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useUpdateBookingStatus } from '../api/queries/bookingQueries'

function BookingsList({ bookings }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [chosenAction, setChosenAction] = useState('')
  const { mutate: updateBookingStatus, isPending: loading } = useUpdateBookingStatus()
  // Group bookings by status
  const pendingBookings = bookings?.filter((b) => b.status === 'pending')
  const confirmedBookings = bookings?.filter((b) => b.status === 'confirmed')
  const pastBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'completed')

  const handleBooking = async ({ status, bookingId }) => {
    updateBookingStatus({ status, id: bookingId })
    setAlertType(status === 'confirmed' ? 'success' : 'warning')
    setChosenAction(
      status === 'confirmed' ? 'Booking request confirmed!' : 'Booking request cancelled!'
    )
    setSnackbarOpen(true)
  }

  const renderBookingCard = (booking) => {
    return (
      <Paper key={booking?._id} variant="outlined" sx={{ mb: 2, p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6">{booking.clientName}</Typography>
              <Chip
                label={booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1)}
                size="small"
                color={
                  booking.status === 'confirmed'
                    ? 'success'
                    : booking.status === 'pending'
                      ? 'warning'
                      : booking.status === 'cancelled'
                        ? 'error'
                        : 'default'
                }
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
                  ...(booking.status === 'cancelled' && {
                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                    color: 'error.dark',
                  }),
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {booking?.space.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(booking.eventDate), 'EEEE, MMMM do yyyy')} •{' '}
              {format(new Date(booking.startTime), 'hh:mm a')} -{' '}
              {format(new Date(booking.endTime), 'hh:mm a')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.clientEmail} • {booking.customerPhone}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="h6">UGX {booking.totalPrice}</Typography>
              <Typography variant="caption" color="text.secondary">
                Total price
              </Typography>
            </Box>

            {booking.status === 'pending' && (
              <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={() => handleBooking({ status: 'cancelled', bookingId: booking._id })}
                  disabled={loading}
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckIcon />}
                  onClick={() => handleBooking({ status: 'confirmed', bookingId: booking._id })}
                  disabled={loading}
                >
                  Accept
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {booking.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2">Notes:</Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.notes}
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    )
  }

  return (
    <Box>
      {pendingBookings.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Pending Requests
          </Typography>
          {pendingBookings.map(renderBookingCard)}
        </Box>
      )}

      {confirmedBookings.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Bookings
          </Typography>
          {confirmedBookings.map(renderBookingCard)}
        </Box>
      )}

      {pastBookings.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Past Bookings
          </Typography>
          {pastBookings.map(renderBookingCard)}
        </Box>
      )}

      {bookings.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No bookings yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have any bookings for your spaces yet.
          </Typography>
        </Paper>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={alertType} sx={{ width: '100%' }} onClose={() => setSnackbarOpen(false)}>
          {chosenAction}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default BookingsList
