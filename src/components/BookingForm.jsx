import { useMemo, useState } from 'react'
import { Box, TextField, Button, Typography, InputAdornment, Snackbar, Alert } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { createBooking } from '../redux/slices/bookingSlice'
import { differenceInMinutes } from 'date-fns'

function BookingForm({ spaceId, price, priceUnit }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const dispatch = useDispatch()
  const { loading: isBookingLoading } = useSelector((state) => state.bookings)

  const formik = useFormik({
    initialValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      eventDate: null,
      startTime: null,
      endTime: null,
      details: '',
    },
    validationSchema: Yup.object({
      clientName: Yup.string().required('Required'),
      clientEmail: Yup.string().email('Invalid email').required('Required'),
      clientPhone: Yup.string().required('Required'),
      eventDate: Yup.date().required('Required').nullable(),
      startTime: Yup.date().required('Required').nullable(),
      endTime: Yup.date().required('Required').nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      await dispatch(createBooking({ ...values, spaceId })).unwrap()
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
    const eventDate = formik.values.eventDate
    const start = combineDateAndTime(eventDate, formik.values.startTime)
    const end = combineDateAndTime(eventDate, formik.values.endTime)
    if (!start || !end || isNaN(start) || isNaN(end)) {
      return { durationHours: 0, durationDays: 0, totalPrice: 0 }
    }
    const minutes = Math.max(0, differenceInMinutes(end, start))
    const hours = Math.ceil(minutes / 60)
    const days = Math.ceil(hours / 24)

    let total = 0
    if (priceUnit === 'hour') total = Math.max(1, hours) * (price || 0)
    else if (priceUnit === 'day') total = Math.max(1, days) * (price || 0)
    else total = price || 0
    return { durationHours: hours, durationDays: days, totalPrice: total }
  }, [formik.values.eventDate, formik.values.startTime, formik.values.endTime, price, priceUnit])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            size="small"
            label="Full Name"
            name="clientName"
            fullWidth
            margin="normal"
            placeholder="Your name"
            value={formik.values.clientName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.clientName && Boolean(formik.errors.clientName)}
            helperText={formik.touched.clientName && formik.errors.clientName}
          />
          <TextField
            size="small"
            label="Email"
            type="email"
            name="clientEmail"
            fullWidth
            margin="normal"
            placeholder="your@email.com"
            value={formik.values.clientEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.clientEmail && Boolean(formik.errors.clientEmail)}
            helperText={formik.touched.clientEmail && formik.errors.clientEmail}
          />
          <TextField
            size="small"
            label="Phone Number"
            name="clientPhone"
            fullWidth
            margin="normal"
            placeholder="0700000000"
            value={formik.values.clientPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.clientPhone && Boolean(formik.errors.clientPhone)}
            helperText={formik.touched.clientPhone && formik.errors.clientPhone}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <DatePicker
            label="Event Date"
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
        </Box>

        <TextField
          label="Event Details"
          name="details"
          multiline
          rows={3}
          fullWidth
          margin="normal"
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
            disabled={isBookingLoading || (priceUnit !== 'event' && durationHours <= 0)}
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
