import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import PeopleIcon from '@mui/icons-material/People'
import EmailIcon from '@mui/icons-material/Email'
import SendIcon from '@mui/icons-material/Send'
import { useFormik } from 'formik'
import * as yup from 'yup'

const contactValidationSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  subject: yup
    .string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters'),
})

function HowItWorksPage() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: contactValidationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Create mailto link with form data
        const subject = encodeURIComponent(values.subject)
        const body = encodeURIComponent(
          `Name: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`
        )
        const mailtoLink = `mailto:dyppulse@gmail.com?subject=${subject}&body=${body}`

        // Open email client
        window.location.href = mailtoLink

        // Show success message
        setSnackbar({
          open: true,
          message:
            'Your email client should open. If not, please email us at support@spacehire.com',
          severity: 'success',
        })

        // Close dialog and reset form after a short delay
        setTimeout(() => {
          setContactDialogOpen(false)
          resetForm()
        }, 1000)
      } catch (error) {
        console.error('Error opening email client:', error)
        setSnackbar({
          open: true,
          message: 'Error opening email client. Please email us at support@spacehire.com',
          severity: 'error',
        })
      }
    },
  })

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          How SpaceHire Works
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          We make it easy to find and book the perfect space for your next event, meeting, or
          creative project.
        </Typography>
      </Box>

      {/* For Clients */}
      <Box sx={{ mb: 10 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
          For Clients
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item size={{ xs: 6, md: 4 }}>
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(13, 148, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                1. Find Your Space
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse our collection of unique venues, studios, and meeting spaces. Use filters to
                narrow down by location, capacity, price, and amenities.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(13, 148, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                2. Book Your Date
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select your preferred date and time, fill in your details, and submit your booking
                request. No login required!
              </Typography>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(13, 148, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                3. Get Confirmation
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The space owner will review and confirm your booking. You'll receive all the details
                you need for your event via email.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            component={Link}
            to="/spaces"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Find a Space
          </Button>
        </Box>
      </Box>

      {/* For Space Owners */}
      <Box sx={{ mb: 10 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
          For Space Owners
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(13, 148, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <HomeWorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                1. List Your Space
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create an account and add your space with photos, description, pricing, and
                availability. It's free to list!
              </Typography>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(13, 148, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                2. Manage Bookings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Receive booking requests, communicate with clients, and confirm or decline bookings
                through your dashboard.
              </Typography>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(13, 148, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CreditCardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                3. Get Paid
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Earn money from your space when it would otherwise be unused. Set your own prices
                and availability.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            component={Link}
            to="/auth/signup"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            List Your Space
          </Button>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Got questions? We've got answers.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                How do I book a space?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse our listings, select a space you like, choose your date and time, and submit
                a booking request. The space owner will confirm your booking.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                Do I need to create an account to book?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No, you don't need an account to book a space. Just provide your contact information
                during the booking process.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                How do I list my space?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create an account as a space owner, then add your space details, photos, pricing,
                and availability. Your space will be visible to potential clients.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                Is there a fee to list my space?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No, listing your space is completely free. We only charge a small service fee when a
                booking is confirmed.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                What if I need to cancel my booking?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cancellation policies vary by space. Please check the specific space's cancellation
                policy before booking.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                How do payments work?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Currently, payments are handled directly between you and the space owner. We're
                working on adding integrated payments soon!
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            onClick={() => setContactDialogOpen(true)}
            variant="outlined"
            size="large"
            startIcon={<EmailIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            Have More Questions? Contact Us
          </Button>
        </Box>
      </Box>

      {/* Contact Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => {
          setContactDialogOpen(false)
          formik.resetForm()
        }}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                autoFocus
              />

              <TextField
                fullWidth
                label="Your Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.subject && Boolean(formik.errors.subject)}
                helperText={formik.touched.subject && formik.errors.subject}
              />

              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
                placeholder="Tell us how we can help you..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => {
                setContactDialogOpen(false)
                formik.resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={!formik.isValid}
            >
              Send Email
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default HowItWorksPage
