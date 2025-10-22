import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
  Divider,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

function BookingSuccessModal({ open, onClose, bookingData, spaceData }) {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        {/* Success Icon */}
        <Box sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'success.main',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your booking has been successfully submitted and is pending approval.
          </Typography>
        </Box>

        {/* Booking Details Card */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3,
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Booking Details
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationOnIcon color="primary" />
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Space
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {spaceData?.name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarTodayIcon color="primary" />
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Event Date
                </Typography>
                <Typography variant="body1">{formatDate(bookingData?.eventDate)}</Typography>
              </Box>
            </Box>

            {bookingData?.startTime && bookingData?.endTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarTodayIcon color="primary" />
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body1">
                    {formatTime(bookingData.startTime)} - {formatTime(bookingData.endTime)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon color="primary" />
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Guests
                </Typography>
                <Typography variant="body1">{bookingData?.guests} people</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AttachMoneyIcon color="primary" />
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${bookingData?.totalPrice?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Status Information */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label="Pending Approval"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The space owner will review your booking and contact you soon.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Next Steps */}
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            What happens next?
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • The space owner will review your booking request
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • You'll receive an email confirmation once approved
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Payment details will be provided by the space owner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • You can track your booking status in your dashboard
            </Typography>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="contained" color="primary" size="large" sx={{ px: 4 }}>
          View Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BookingSuccessModal
