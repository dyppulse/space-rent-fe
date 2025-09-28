import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  Chip,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import EventIcon from '@mui/icons-material/Event'

function BookingStep1({ formik, space, durationHours, totalPrice }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Event Details
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Tell us about your event so we can prepare the perfect space for you.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formik.errors.bookingType}>
              <InputLabel>Booking Type</InputLabel>
              <Select
                value={formik.values.bookingType}
                onChange={(e) => formik.setFieldValue('bookingType', e.target.value)}
                label="Booking Type"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="single">Single Day</MenuItem>
                <MenuItem value="multi">Multiple Days</MenuItem>
              </Select>
              {formik.errors.bookingType && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {formik.errors.bookingType}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {formik.values.bookingType === 'single' ? (
            <>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Event Date"
                  value={formik.values.eventDate}
                  onChange={(date) => formik.setFieldValue('eventDate', date)}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formik.errors.eventDate,
                      helperText: formik.errors.eventDate,
                    },
                  }}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Check-in Date"
                  value={formik.values.checkInDate}
                  onChange={(date) => formik.setFieldValue('checkInDate', date)}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formik.errors.checkInDate,
                      helperText: formik.errors.checkInDate,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Check-out Date"
                  value={formik.values.checkOutDate}
                  onChange={(date) => formik.setFieldValue('checkOutDate', date)}
                  minDate={formik.values.checkInDate || new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formik.errors.checkOutDate,
                      helperText: formik.errors.checkOutDate,
                    },
                  }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Event Type"
              value={formik.values.eventType}
              onChange={(e) => formik.setFieldValue('eventType', e.target.value)}
              error={!!formik.errors.eventType}
              helperText={
                formik.errors.eventType || 'e.g., Conference, Workshop, Meeting, Wedding, etc.'
              }
              placeholder="What type of event is this?"
            />
          </Grid>

          {formik.values.bookingType === 'single' && (
            <>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Start Time"
                  value={formik.values.startTime}
                  onChange={(time) => formik.setFieldValue('startTime', time)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formik.errors.startTime,
                      helperText: formik.errors.startTime,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="End Time"
                  value={formik.values.endTime}
                  onChange={(time) => formik.setFieldValue('endTime', time)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formik.errors.endTime,
                      helperText: formik.errors.endTime,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Guests"
              type="number"
              value={formik.values.guests || ''}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  formik.setFieldValue('guests', '')
                } else {
                  const numValue = parseInt(value)
                  if (!isNaN(numValue) && numValue > 0) {
                    formik.setFieldValue('guests', numValue)
                  }
                }
              }}
              error={!!formik.errors.guests}
              helperText={formik.errors.guests || 'Minimum 1 guest required'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: 1,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Special Requests"
              multiline
              rows={3}
              value={formik.values.specialRequests}
              onChange={(e) => formik.setFieldValue('specialRequests', e.target.value)}
              placeholder="Any special requirements or requests for your event..."
            />
          </Grid>
        </Grid>

        {/* Pricing Summary */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mt: 4,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <EventIcon color="primary" fontSize="small" />
            <Typography variant="h6" color="primary" fontWeight="medium">
              Pricing Summary
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="#666666" gutterBottom>
                  {formik.values.bookingType === 'single' ? 'Duration' : 'Nights'}
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="#000000">
                  {formik.values.bookingType === 'single'
                    ? durationHours > 0
                      ? `${durationHours.toFixed(1)} hours`
                      : 'Select time'
                    : formik.values.checkInDate && formik.values.checkOutDate
                      ? `${Math.ceil((new Date(formik.values.checkOutDate) - new Date(formik.values.checkInDate)) / (1000 * 60 * 60 * 24))} nights`
                      : 'Select dates'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="#666666" gutterBottom>
                  Rate
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="#000000">
                  ${space?.price?.amount}/{space?.price?.unit}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 1,
                  mt: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total Amount
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  )
}

export default BookingStep1
