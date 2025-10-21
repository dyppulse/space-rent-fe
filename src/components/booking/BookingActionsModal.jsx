import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Alert,
  TextField,
  Stack,
  Avatar,
  Grid,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import { useState } from 'react'
import { useUpdateBookingStatus } from '../../api/queries/bookingQueries'

function BookingActionsModal({ open, onClose, booking, actionType, onSuccess }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState(null)

  const { mutate: updateBookingStatus, isPending: isLoading } = useUpdateBookingStatus()

  const formatDate = (date) => {
    if (!date) return 'Not specified'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time) => {
    if (!time) return 'Not specified'
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleConfirm = async () => {
    setError(null)

    // Map action type to booking status
    const statusMap = {
      accept: 'confirmed',
      decline: 'declined',
      cancel: 'cancelled',
    }

    const status = statusMap[actionType]

    if (!status) {
      setError('Invalid action type')
      return
    }

    updateBookingStatus(
      {
        id: booking._id || booking.id,
        status,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          handleClose()
          if (onSuccess) {
            onSuccess()
          }
        },
        onError: (err) => {
          console.error('Error updating booking status:', err)
          setError(err.response?.data?.message || 'Failed to update booking. Please try again.')
        },
      }
    )
  }

  const handleClose = () => {
    setReason('')
    setError(null)
    onClose()
  }

  const getModalTitle = () => {
    switch (actionType) {
      case 'accept':
        return 'Accept Booking Request'
      case 'decline':
        return 'Decline Booking Request'
      case 'view':
        return 'Booking Details'
      case 'edit':
        return 'Edit Booking'
      case 'cancel':
        return 'Cancel Booking'
      default:
        return 'Booking Action'
    }
  }

  const getModalContent = () => {
    if (actionType === 'view') {
      return (
        <Box>
          {/* Booking Overview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>{getInitials(booking?.space?.name)}</Avatar>
              <Box>
                <Typography variant="h6">{booking?.space?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking?.space?.location?.address}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Event Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Event Details
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarTodayIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Date
                    </Typography>
                    <Typography variant="body1">{formatDate(booking?.eventDate)}</Typography>
                  </Box>
                </Box>

                {booking?.startTime && booking?.endTime && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarTodayIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body1">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PeopleIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Guests
                    </Typography>
                    <Typography variant="body1">{booking?.guests} people</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AttachMoneyIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ${booking?.totalPrice?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact Information
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{booking?.clientName}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{booking?.clientEmail}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{booking?.clientPhone}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Special Requests */}
          {booking?.specialRequests && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Special Requests:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.specialRequests}
              </Typography>
            </Box>
          )}
        </Box>
      )
    }

    // For accept/decline/cancel actions
    return (
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert
          severity={
            actionType === 'accept' ? 'success' : actionType === 'decline' ? 'warning' : 'error'
          }
          sx={{ mb: 3 }}
        >
          {actionType === 'accept' && 'Are you sure you want to accept this booking request?'}
          {actionType === 'decline' && 'Are you sure you want to decline this booking request?'}
          {actionType === 'cancel' &&
            'Are you sure you want to cancel this booking? This action cannot be undone.'}
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Booking Summary
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body1" gutterBottom>
              <strong>Space:</strong> {booking?.space?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date:</strong> {formatDate(booking?.eventDate)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Guests:</strong> {booking?.guests} people
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Amount:</strong> ${booking?.totalPrice?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body1">
              <strong>Client:</strong> {booking?.clientName}
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          label={
            actionType === 'decline'
              ? 'Reason for declining (optional)'
              : actionType === 'cancel'
                ? 'Reason for cancellation (optional)'
                : 'Notes (optional)'
          }
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={
            actionType === 'decline'
              ? 'Please provide a reason for declining this booking...'
              : actionType === 'cancel'
                ? 'Please provide a reason for cancelling this booking...'
                : 'Add any additional notes...'
          }
        />
      </Box>
    )
  }

  const getConfirmButtonProps = () => {
    switch (actionType) {
      case 'accept':
        return { color: 'success', text: 'Accept Booking' }
      case 'decline':
        return { color: 'warning', text: 'Decline Booking' }
      case 'cancel':
        return { color: 'error', text: 'Cancel Booking' }
      default:
        return { color: 'primary', text: 'Confirm' }
    }
  }

  const buttonProps = getConfirmButtonProps()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {actionType === 'accept' && <CheckCircleIcon color="success" />}
          {actionType === 'decline' && <CancelIcon color="warning" />}
          {actionType === 'view' && <VisibilityIcon color="primary" />}
          {actionType === 'cancel' && <CancelIcon color="error" />}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {getModalTitle()}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>{getModalContent()}</DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          {actionType === 'view' ? 'Close' : 'Cancel'}
        </Button>

        {actionType !== 'view' && (
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={buttonProps.color}
            disabled={isLoading}
            sx={{ px: 3 }}
          >
            {isLoading ? 'Processing...' : buttonProps.text}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default BookingActionsModal
