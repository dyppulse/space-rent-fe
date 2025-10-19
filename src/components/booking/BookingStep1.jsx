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
  IconButton,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import EventIcon from '@mui/icons-material/Event'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

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

          {formik.values.bookingType === 'single' && space?.price?.unit === 'hour' && (
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

          {formik.values.bookingType === 'single' &&
            space?.price?.unit === 'day' &&
            formik.values.eventDate && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.dark">
                    <strong>Full day booking</strong> - This space is priced per day. You'll have
                    access to the space for the entire day on{' '}
                    {new Date(formik.values.eventDate).toLocaleDateString()}.
                  </Typography>
                </Box>
              </Grid>
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
              sx={{
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const currentValue = formik.values.guests || 1
                          if (currentValue > 1) {
                            formik.setFieldValue('guests', currentValue - 1)
                          }
                        }}
                        disabled={!formik.values.guests || formik.values.guests <= 1}
                        sx={{
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' },
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const currentValue = formik.values.guests || 0
                          formik.setFieldValue('guests', currentValue + 1)
                        }}
                        sx={{
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
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

        {/* Receipt-Style Pricing Summary */}
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            bgcolor: 'background.paper',
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {/* Receipt Header */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'),
              borderBottom: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={0.5}>
              <EventIcon color="primary" fontSize="small" />
              <Typography variant="h6" fontWeight="700" textAlign="center">
                BOOKING SUMMARY
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
              {space?.name}
            </Typography>
          </Box>

          {/* Receipt Body */}
          <Box sx={{ p: 3 }}>
            {/* Line Items */}
            <Box sx={{ mb: 2 }}>
              {/* Space Type */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Space Type
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {space?.spaceTypes?.length > 0
                    ? space.spaceTypes.map((st) => st.name).join(', ')
                    : space?.spaceType?.name || 'N/A'}
                </Typography>
              </Box>

              {/* Duration/Nights */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {formik.values.bookingType === 'single'
                    ? space?.price?.unit === 'hour'
                      ? 'Duration'
                      : 'Booking Period'
                    : 'Nights'}
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {formik.values.bookingType === 'single'
                    ? space?.price?.unit === 'hour'
                      ? durationHours > 0
                        ? `${durationHours.toFixed(1)} hours`
                        : '---'
                      : '1 full day'
                    : formik.values.checkInDate && formik.values.checkOutDate
                      ? `${Math.ceil((new Date(formik.values.checkOutDate) - new Date(formik.values.checkInDate)) / (1000 * 60 * 60 * 24))} nights`
                      : '---'}
                </Typography>
              </Box>

              {/* Rate */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Rate
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  UGX {space?.price?.amount?.toLocaleString()} / {space?.price?.unit}
                </Typography>
              </Box>

              {/* Guests */}
              {formik.values.guests && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Guests
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {formik.values.guests} {formik.values.guests === 1 ? 'person' : 'people'}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Divider */}
            <Box
              sx={{
                borderTop: '2px dashed',
                borderColor: 'divider',
                my: 2,
              }}
            />

            {/* Subtotal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" fontWeight="600">
                Subtotal
              </Typography>
              <Typography variant="body1" fontWeight="600">
                UGX {totalPrice > 0 ? totalPrice.toLocaleString() : '0.00'}
              </Typography>
            </Box>

            {/* Total */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 1.5,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" fontWeight="700">
                TOTAL
              </Typography>
              <Typography variant="h5" fontWeight="700">
                UGX {totalPrice > 0 ? totalPrice.toLocaleString() : '0.00'}
              </Typography>
            </Box>
          </Box>

          {/* Receipt Footer */}
          <Box
            sx={{
              p: 2,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'),
              borderTop: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              This is a preliminary quote. Final pricing will be confirmed by the space owner.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  )
}

export default BookingStep1
