import { useMemo, useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useCreateBooking } from '../api/queries/bookingQueries'
import { differenceInMinutes } from 'date-fns'

function BookingForm({ spaceId, price, priceUnit, capacity }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const { mutate: createBooking, isPending: isBookingLoading } = useCreateBooking()

  const formik = useFormik({
    initialValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      eventDate: null,
      startTime: null,
      endTime: null,
      checkInDate: null,
      checkOutDate: null,
      guests: 1,
      details: '',
    },
    validationSchema: Yup.object({
      clientName: Yup.string().required('Required'),
      clientEmail: Yup.string().email('Invalid email').required('Required'),
      clientPhone: Yup.string().required('Required'),
      eventDate:
        priceUnit === 'hour' || priceUnit === 'day'
          ? Yup.date().required('Required').nullable()
          : Yup.date().nullable(),
      startTime:
        priceUnit === 'hour' ? Yup.date().required('Required').nullable() : Yup.date().nullable(),
      endTime:
        priceUnit === 'hour' ? Yup.date().required('Required').nullable() : Yup.date().nullable(),
      guests: Yup.number()
        .min(1, 'At least 1 guest required')
        .test(
          'capacity-check',
          `This venue can only accommodate ${capacity || 50} guests`,
          function (value) {
            return !value || value <= (capacity || 50)
          }
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      createBooking({
        ...values,
        spaceId,
        bookingType: 'single', // Single day booking
      })
      setSnackbarOpen(true)
      resetForm?.()
    },
  })

  const combineDateAndTime = (date, time) => {
    if (!date || !time) return null
    const d = new Date(date)
    const t = new Date(time)
    d.setHours(t.getHours(), t.getMinutes(), 0, 0)
    return d
  }

  const { durationHours, durationDays, totalPrice } = useMemo(() => {
    let hours = 0
    let days = 0
    if (priceUnit === 'hour') {
      const eventDate = formik.values.eventDate
      const start = combineDateAndTime(eventDate, formik.values.startTime)
      const end = combineDateAndTime(eventDate, formik.values.endTime)
      if (start && end && !isNaN(start) && !isNaN(end)) {
        const minutes = Math.max(0, differenceInMinutes(end, start))
        hours = Math.ceil(minutes / 60)
        days = Math.ceil(hours / 24)
      }
    } else if (priceUnit === 'day') {
      // For single day booking, just count 1 day if eventDate is set
      if (formik.values.eventDate) {
        days = 1
        hours = 24
      }
    }
    let total = 0
    if (priceUnit === 'hour') total = Math.max(1, hours) * (price || 0)
    else if (priceUnit === 'day') total = days * (price || 0)
    else total = price || 0
    return { durationHours: hours, durationDays: days, totalPrice: total }
  }, [formik.values.eventDate, formik.values.startTime, formik.values.endTime, price, priceUnit])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            label="Full name"
            name="clientName"
            fullWidth
            placeholder="Your name"
            value={formik.values.clientName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.clientName && Boolean(formik.errors.clientName)}
            helperText={formik.touched.clientName && formik.errors.clientName}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              size="small"
              label="Email"
              type="email"
              name="clientEmail"
              fullWidth
              placeholder="your@email.com"
              value={formik.values.clientEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.clientEmail && Boolean(formik.errors.clientEmail)}
              helperText={formik.touched.clientEmail && formik.errors.clientEmail}
            />
            <TextField
              size="small"
              label="Phone"
              name="clientPhone"
              fullWidth
              placeholder="0700000000"
              value={formik.values.clientPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.clientPhone && Boolean(formik.errors.clientPhone)}
              helperText={formik.touched.clientPhone && formik.errors.clientPhone}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <DatePicker
            label={priceUnit === 'day' ? 'Booking Date' : 'Event Date'}
            value={formik.values.eventDate}
            onChange={(value) => formik.setFieldValue('eventDate', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                size="small"
                error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                helperText={formik.touched.eventDate && formik.errors.eventDate}
              />
            )}
            disablePast
          />

          {priceUnit === 'hour' && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TimePicker
                  label="Start Time"
                  value={formik.values.startTime}
                  onChange={(value) => formik.setFieldValue('startTime', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                      helperText={formik.touched.startTime && formik.errors.startTime}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <TimePicker
                  label="End Time"
                  value={formik.values.endTime}
                  onChange={(value) => formik.setFieldValue('endTime', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                      helperText={formik.touched.endTime && formik.errors.endTime}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              {formik.values.startTime && formik.values.endTime && durationHours <= 0 && (
                <Typography variant="caption" color="error">
                  End time must be after start time
                </Typography>
              )}
            </>
          )}

          {priceUnit === 'day' && formik.values.eventDate && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Full day booking - {new Date(formik.values.eventDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <TextField
          label="Event details"
          name="details"
          multiline
          rows={3}
          fullWidth
          placeholder="Tell us about your event"
          value={formik.values.details}
          onChange={formik.handleChange}
        />

        <Box sx={{ mt: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Price
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              UGX {price}/{priceUnit}
            </Typography>
          </Box>
          {(priceUnit === 'hour' || priceUnit === 'day') && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {priceUnit === 'hour'
                  ? `${Math.max(1, durationHours)} hour(s)`
                  : `${Math.max(1, durationDays)} day(s)`}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" fontWeight="medium">
              Total
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              UGX {totalPrice}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={
              isBookingLoading ||
              (priceUnit === 'hour' && durationHours <= 0) ||
              (priceUnit === 'day' && !formik.values.eventDate)
            }
            startIcon={isBookingLoading ? <CircularProgress color="inherit" size={18} /> : null}
          >
            {isBookingLoading ? 'Submitting...' : 'Request to Book'}
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ display: 'block', mt: 1 }}
          >
            You won't be charged yet. The space owner will confirm availability.
          </Typography>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="success" sx={{ width: '100%' }} onClose={() => setSnackbarOpen(false)}>
            Booking request submitted!
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  )
}

export default BookingForm
