import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Stack,
} from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import BusinessIcon from '@mui/icons-material/Business'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import ReceiptIcon from '@mui/icons-material/Receipt'

function BookingStep3({ formik, space, durationHours, totalPrice }) {
  const formatDate = (date) => {
    if (!date) return 'Not selected'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time) => {
    if (!time) return 'Not selected'
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Review Your Booking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please review all the details before proceeding to payment
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Space Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <BusinessIcon />
                </Avatar>
              }
              title="Space Details"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {space?.name}
                </Typography>
                <Chip
                  label={
                    space?.spaceTypes?.length > 0
                      ? space.spaceTypes.map((st) => st.name).join(', ')
                      : space?.spaceType?.name || space?.spaceTypeName
                  }
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Box>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {space?.location?.address || 'Address not available'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AttachMoneyIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rate
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ${space?.price?.amount}/{space?.price?.unit}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <CalendarTodayIcon />
                </Avatar>
              }
              title="Event Details"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EventIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formatDate(formik.values.eventDate)}
                    </Typography>
                  </Box>
                </Box>

                {formik.values.startTime && formik.values.endTime && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessTimeIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body1">
                        {formatTime(formik.values.startTime)} - {formatTime(formik.values.endTime)}
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
                    <Typography variant="body1">{formik.values.guests} people</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EventIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Type
                    </Typography>
                    <Typography variant="body1">
                      {formik.values.eventType || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {formik.values.specialRequests && (
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
                    {formik.values.specialRequests}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <ContactMailIcon />
                </Avatar>
              }
              title="Contact Information"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formik.values.clientName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{formik.values.clientEmail}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{formik.values.clientPhone}</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing Summary */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{ height: '100%', border: '2px solid', borderColor: 'primary.main' }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <ReceiptIcon />
                </Avatar>
              }
              title="Pricing Summary"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body1">Duration:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {durationHours > 0 ? `${durationHours.toFixed(1)} hours` : 'Full day'}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body1">Rate:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ${space?.price?.amount}/{space?.price?.unit}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Chip
                    label={`$${totalPrice.toFixed(2)}`}
                    color="primary"
                    size="large"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      px: 2,
                      py: 1,
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BookingStep3
