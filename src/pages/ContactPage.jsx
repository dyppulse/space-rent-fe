import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
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

function ContactPage() {
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
          message: 'Your email client should open. If not, please email us at dyppulse@gmail.com',
          severity: 'success',
        })

        // Reset form after a short delay
        setTimeout(() => {
          resetForm()
        }, 1000)
      } catch (error) {
        console.error('Error opening email client:', error)
        setSnackbar({
          open: true,
          message: 'Error opening email client. Please email us at dyppulse@gmail.com',
          severity: 'error',
        })
      }
    },
  })

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mt: 2 }}>
          Have questions? We're here to help! Reach out to us and we'll get back to you as soon as
          possible.
        </Typography>
      </Box>

      {/* Contact Form */}
      <Paper elevation={2} sx={{ mb: 6, p: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Send Us a Message
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Fill out the form below and we'll get back to you as soon as possible.
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
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
            placeholder="What is this regarding?"
          />

          <TextField
            fullWidth
            label="Message"
            name="message"
            multiline
            rows={6}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
            placeholder="Tell us how we can help you..."
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            disabled={!formik.isValid}
            sx={{ px: 4, alignSelf: 'flex-start' }}
          >
            Send Message
          </Button>
        </Box>
      </Paper>

      {/* Contact Information Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Other Ways to Reach Us
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'rgba(35, 134, 54, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 30, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Email Us
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Send us an email anytime!
                </Typography>
                <Typography
                  variant="body1"
                  component="a"
                  href="mailto:dyppulse@gmail.com"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  dyppulse@gmail.com
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'rgba(35, 134, 54, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 30, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Call Us
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Available during business hours
                </Typography>
                <Typography
                  variant="body1"
                  component="a"
                  href="tel:+256775681668"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  +256 775 681 668
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'rgba(35, 134, 54, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 30, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Location
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Based in Uganda
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Kampala, Uganda
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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

export default ContactPage
