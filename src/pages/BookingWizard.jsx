import { useState, useMemo } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Dialog,
  IconButton,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import { useCreateBooking } from '../api/queries/bookingQueries'
import { useSpace } from '../api/queries/spaceQueries'
import BookingStep1 from '../components/booking/BookingStep1'
import BookingStep2 from '../components/booking/BookingStep2'
import BookingStep3 from '../components/booking/BookingStep3'
import BookingStep4 from '../components/booking/BookingStep4'
import BookingSuccessModal from '../components/booking/BookingSuccessModal'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// MVP: Hide payment step for now, will be enabled in future release
// TODO: Set PAYMENT_STEP_ENABLED = true when payment feature is ready for production
const PAYMENT_STEP_ENABLED = false

const allSteps = ['Event Details', 'Contact Information', 'Review & Confirm', 'Payment']
const steps = PAYMENT_STEP_ENABLED ? allSteps : allSteps.slice(0, -1) // Remove 'Payment' step for MVP

function BookingWizard() {
  const { id: spaceId } = useParams()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  // Snackbar state for future use
  // const [snackbarOpen, setSnackbarOpen] = useState(false)
  // const [snackbarMessage, setSnackbarMessage] = useState('')
  // const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const { mutate: createBooking, isPending: isBookingLoading } = useCreateBooking()

  // Fetch space details
  const { data: space, isLoading: spaceLoading, error: spaceError } = useSpace(spaceId)

  // Debug logging
  console.log('BookingWizard Debug:', {
    spaceId,
    spaceLoading,
    spaceError,
    space,
    spaceType: typeof space,
    spaceKeys: space ? Object.keys(space) : 'no space object',
  })

  const formik = useFormik({
    initialValues: {
      // Event details
      bookingType: 'single', // Default to single day
      eventDate: null,
      startTime: null,
      endTime: null,
      checkInDate: null,
      checkOutDate: null,
      guests: '',
      eventType: '',
      specialRequests: '',

      // Contact information
      clientName: '',
      clientEmail: '',
      clientPhone: '',

      // Payment (for future use)
      paymentMethod: 'cash', // Default to cash for now
      mobileMoneyPhone: '', // For mobile money payments
    },
    validationSchema: Yup.object({
      // Event details validation
      bookingType: Yup.string().required('Booking type is required'),
      eventDate: Yup.date().when('bookingType', {
        is: 'single',
        then: (schema) => schema.required('Event date is required'),
        otherwise: (schema) => schema.nullable(),
      }),
      startTime: Yup.date().nullable(),
      endTime: Yup.date().nullable(),
      checkInDate: Yup.date().when('bookingType', {
        is: 'multi',
        then: (schema) => schema.required('Check-in date is required'),
        otherwise: (schema) => schema.nullable(),
      }),
      checkOutDate: Yup.date().when('bookingType', {
        is: 'multi',
        then: (schema) => schema.required('Check-out date is required'),
        otherwise: (schema) => schema.nullable(),
      }),
      guests: Yup.number()
        .min(1, 'At least 1 guest required')
        .required('Number of guests is required'),
      eventType: Yup.string().required('Event type is required'),

      // Contact validation
      clientName: Yup.string().required('Full name is required'),
      clientEmail: Yup.string().email('Invalid email').required('Email is required'),
      clientPhone: Yup.string().required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      try {
        const bookingData = {
          spaceId,
          ...values,
          // Combine date and time for backend
          eventDateTime: combineDateAndTime(values.eventDate, values.startTime),
          endDateTime: combineDateAndTime(values.eventDate, values.endTime),
        }

        createBooking(bookingData, {
          onSuccess: () => {
            console.log('Booking created successfully!')
            setBookingData({ ...values, totalPrice })
            setShowSuccessModal(true)
          },
          onError: (error) => {
            console.error('Failed to create booking:', error)
          },
        })
      } catch (error) {
        console.error('Booking submission error:', error)
        // TODO: Add proper error handling with snackbar
      }
    },
  })

  const combineDateAndTime = (date, time) => {
    if (!date || !time) return null
    const d = new Date(date)
    const t = new Date(time)
    d.setHours(t.getHours(), t.getMinutes(), 0, 0)
    return d
  }

  // Calculate pricing
  const { durationHours, totalPrice } = useMemo(() => {
    if (!space?.price) return { durationHours: 0, totalPrice: 0 }

    const { bookingType, eventDate, startTime, endTime, checkInDate, checkOutDate } = formik.values

    if (bookingType === 'single') {
      // Single day booking
      if (space.price.unit === 'hour') {
        // For hourly pricing, require start and end times
        if (!eventDate || !startTime || !endTime) return { durationHours: 0, totalPrice: 0 }

        const start = combineDateAndTime(eventDate, startTime)
        const end = combineDateAndTime(eventDate, endTime)

        if (!start || !end) return { durationHours: 0, totalPrice: 0 }

        const durationMs = end - start
        const durationHours = Math.max(0, durationMs / (1000 * 60 * 60))

        const totalPrice = space.price.amount * Math.ceil(durationHours)
        return { durationHours, totalPrice }
      } else if (space.price.unit === 'day') {
        // For daily pricing, just need the date - it's a full day booking
        if (!eventDate) return { durationHours: 0, totalPrice: 0 }

        const durationHours = 24 // Full day
        const totalPrice = space.price.amount // Fixed price for the day

        return { durationHours, totalPrice }
      } else {
        // Event pricing
        const totalPrice = space.price.amount
        return { durationHours: 24, totalPrice }
      }
    } else {
      // Multi-day booking
      if (!checkInDate || !checkOutDate) return { durationHours: 0, totalPrice: 0 }

      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)

      // Calculate nights properly - checkOut should be after checkIn
      if (checkOut <= checkIn) return { durationHours: 0, totalPrice: 0 }

      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      if (nights <= 0) return { durationHours: 0, totalPrice: 0 }

      let totalPrice = 0
      if (space.price.unit === 'day') {
        totalPrice = space.price.amount * nights
      } else if (space.price.unit === 'hour') {
        // For hourly spaces, charge for 24 hours per night
        totalPrice = space.price.amount * 24 * nights
      } else {
        // For event pricing, charge per night
        totalPrice = space.price.amount * nights
      }

      return { durationHours: nights * 24, totalPrice }
    }
  }, [formik.values, space?.price])

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepErrors = getStepErrors(activeStep)
    if (Object.keys(currentStepErrors).length > 0) {
      formik.setTouched(getStepTouchedFields(activeStep))
      return
    }
    // Mark current step as completed
    setCompletedSteps((prev) => ({ ...prev, [activeStep]: true }))
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepClick = (step) => {
    // Allow clicking on current step or completed steps
    if (step <= activeStep || completedSteps[step - 1]) {
      setActiveStep(step)
    }
  }

  const getStepErrors = (step) => {
    const errors = {}
    const values = formik.values

    switch (step) {
      case 0: // Event Details
        if (!values.bookingType) errors.bookingType = 'Required'
        if (!values.eventType) errors.eventType = 'Required'
        if (values.guests < 1) errors.guests = 'At least 1 guest required'

        if (values.bookingType === 'single') {
          if (!values.eventDate) errors.eventDate = 'Required'
          // Only require start/end times for hourly priced spaces
          if (space?.price?.unit === 'hour') {
            if (!values.startTime) errors.startTime = 'Required'
            if (!values.endTime) errors.endTime = 'Required'
          }
        } else if (values.bookingType === 'multi') {
          if (!values.checkInDate) errors.checkInDate = 'Required'
          if (!values.checkOutDate) errors.checkOutDate = 'Required'
        }
        break
      case 1: // Contact Information
        if (!values.clientName) errors.clientName = 'Required'
        if (!values.clientEmail) errors.clientEmail = 'Required'
        if (!values.clientPhone) errors.clientPhone = 'Required'
        break
      default:
        break
    }

    return errors
  }

  const getStepTouchedFields = (step) => {
    const touched = {}

    switch (step) {
      case 0:
        touched.bookingType = true
        touched.eventType = true
        touched.guests = true

        if (formik.values.bookingType === 'single') {
          touched.eventDate = true
          // Only touch start/end times for hourly priced spaces
          if (space?.price?.unit === 'hour') {
            touched.startTime = true
            touched.endTime = true
          }
        } else if (formik.values.bookingType === 'multi') {
          touched.checkInDate = true
          touched.checkOutDate = true
        }
        break
      case 1:
        touched.clientName = true
        touched.clientEmail = true
        touched.clientPhone = true
        break
      default:
        break
    }

    return touched
  }

  const isStepValid = (step) => {
    return Object.keys(getStepErrors(step)).length === 0
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setBookingData(null)
    navigate('/dashboard')
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BookingStep1
            formik={formik}
            space={space}
            durationHours={durationHours}
            totalPrice={totalPrice}
          />
        )
      case 1:
        return <BookingStep2 formik={formik} />
      case 2:
        return (
          <BookingStep3
            formik={formik}
            space={space}
            durationHours={durationHours}
            totalPrice={totalPrice}
          />
        )
      case 3:
        // Payment step - only render if enabled
        return PAYMENT_STEP_ENABLED ? (
          <BookingStep4 formik={formik} space={space} totalPrice={totalPrice} />
        ) : null
      default:
        return null
    }
  }

  if (spaceLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (spaceError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Error loading space: {spaceError?.message || 'Unknown error'}
        </Alert>
      </Container>
    )
  }

  if (!space) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Space not found. Debug info: spaceId={spaceId}, loading={spaceLoading}, error=
          {spaceError?.message}
        </Alert>
      </Container>
    )
  }

  return (
    <Dialog
      open={true}
      onClose={() => navigate(`/spaces/${spaceId}`)}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
          m: 0,
          borderRadius: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1000,
          p: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h1" gutterBottom>
                Book {space.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {space.spaceTypes?.length > 0
                  ? space.spaceTypes.map((st) => st.name).join(', ')
                  : space.spaceType?.name || space.spaceTypeName}{' '}
                • ${space.price?.amount}/{space.price?.unit}
              </Typography>
            </Box>
            <IconButton onClick={() => navigate(`/spaces/${spaceId}`)} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 3, minHeight: 'calc(100vh - 200px)' }}>
          {/* Sidebar - Stepper */}
          <Box
            sx={{
              width: 280,
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 3,
              height: 'fit-content',
              position: 'sticky',
              top: 100,
            }}
          >
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, idx) => (
                <Step key={label} completed={completedSteps[idx]}>
                  <StepButton
                    onClick={() => handleStepClick(idx)}
                    disabled={idx > activeStep && !completedSteps[idx - 1]}
                  >
                    <StepLabel error={idx === activeStep && !isStepValid(idx)}>{label}</StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Content Area */}
          <Box sx={{ flex: 1 }}>
            {/* Step Content */}
            <Paper elevation={1} sx={{ p: 4, borderRadius: 2, minHeight: '500px' }}>
              {renderStepContent(activeStep)}
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Navigation Footer - Full Width */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          zIndex: 1000,
          p: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext} color="primary">
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={formik.handleSubmit}
                disabled={isBookingLoading}
                startIcon={isBookingLoading ? <CircularProgress size={18} /> : null}
                color="success"
              >
                {isBookingLoading ? 'Creating Booking...' : 'Complete Booking'}
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Success Modal */}
      <BookingSuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        bookingData={bookingData}
        spaceData={space}
      />
    </Dialog>
  )
}

export default BookingWizard
