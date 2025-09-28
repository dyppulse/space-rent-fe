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
} from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'

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
      <Typography variant="h6" gutterBottom>
        Review Your Booking
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Please review all the details before proceeding to payment.
      </Typography>

      <Grid container spacing={3}>
        {/* Space Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Space Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                {space?.name}
              </Typography>
              <Chip
                label={
                  space?.spaceTypes?.length > 0
                    ? space.spaceTypes.map((st) => st.name).join(', ')
                    : space?.spaceType?.name || space?.spaceTypeName
                }
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              />
            </Box>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Location"
                  secondary={space?.location?.address || 'Address not available'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AttachMoneyIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Rate"
                  secondary={`$${space?.price?.amount}/${space?.price?.unit}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Event Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Event Date"
                  secondary={formatDate(formik.values.eventDate)}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Time"
                  secondary={`${formatTime(formik.values.startTime)} - ${formatTime(formik.values.endTime)}`}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <PeopleIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Guests" secondary={`${formik.values.guests} people`} />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <EventIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Event Type"
                  secondary={formik.values.eventType || 'Not specified'}
                />
              </ListItem>
            </List>

            {formik.values.specialRequests && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Special Requests:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formik.values.specialRequests}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Name" secondary={formik.values.clientName} />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={formik.values.clientEmail} />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Phone" secondary={formik.values.clientPhone} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Pricing Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pricing Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Duration:</Typography>
                <Typography variant="body2">
                  {durationHours > 0 ? `${durationHours.toFixed(1)} hours` : '0 hours'}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Rate:</Typography>
                <Typography variant="body2">
                  ${space?.price?.amount}/{space?.price?.unit}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Total:</Typography>
              <Chip
                label={`$${totalPrice.toFixed(2)}`}
                color="primary"
                size="large"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BookingStep3
