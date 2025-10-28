import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CircularProgress from '@mui/material/CircularProgress'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { useFormik } from 'formik'
import * as yup from 'yup'
import PhoneInputFormik from '../components/PhoneInput'
import { useAuth } from '../contexts/AuthContext'

import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material'
import { useState } from 'react'

function SignupPage() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const { signup, isSignupLoading } = useAuth()

  const validationSchema = yup.object({
    fullName: yup.string().required('Required').min(5, 'At least 5 characters'),
    email: yup.string().email('Invalid Email').required('Required'),
    password: yup
      .string()
      .required('required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must contain at least one number and one special character'
      ),
    confirmPassword: yup
      .string()
      .required('required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    country: yup.object().nullable().required('Select your country'),
    phoneNumber: yup
      .string()
      .required('Required')
      .test('min-length', 'Phone number is too short', function (value) {
        const local = (value || '').replace(/\D/g, '')
        return local.length >= 5
      })
      .test('e164-length', 'Invalid phone number', function (value) {
        const { country } = this.parent || {}
        const dial = (country?.phone || '').replace(/\D/g, '')
        const local = (value || '').replace(/\D/g, '')
        const total = `${dial}${local}`
        return total.length >= 8 && total.length <= 15
      }),
  })

  const handleSignup = async (values) => {
    try {
      const dial = values?.country?.phone || ''
      const local = (values?.phoneNumber || '').replace(/\D/g, '')
      const combined = `${dial}${local}`
      const e164 = combined.startsWith('+') ? combined : `+${dial}${local}`

      await signup({
        name: values?.fullName,
        email: values?.email,
        password: values?.password,
        phone: e164,
      })

      // Success case - check if there's an intended space to book
      const intendedSpaceId = localStorage.getItem('intendedSpaceId')
      if (intendedSpaceId) {
        localStorage.removeItem('intendedSpaceId')
        navigate(`/spaces/${intendedSpaceId}/book`)
      } else {
        navigate('/dashboard')
      }
      setToast({ open: true, message: 'Account created successfully!', severity: 'success' })
    } catch (error) {
      // Extract error message from backend response
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to create account'
      setToast({
        open: true,
        message: errorMessage,
        severity: 'error',
      })
    }
  }

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      country: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values)
      console.log('Form errors:', formik.errors)
      console.log('Form touched:', formik.touched)
      await handleSignup(values)
    },
  })

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create an account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create an account to book and manage spaces
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            size="small"
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.fullName && formik.errors.fullName}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          />
          <PhoneInputFormik formik={formik} formikValue={'phoneNumber'} size="small" />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.email && formik.errors.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.password && formik.errors.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={<Checkbox value="terms" color="primary" />}
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link to="/terms">
                  <Typography component="span" variant="body2" color="primary">
                    terms of service
                  </Typography>
                </Link>{' '}
                and{' '}
                <Link to="/privacy">
                  <Typography component="span" variant="body2" color="primary">
                    privacy policy
                  </Typography>
                </Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSignupLoading}
            onClick={async (e) => {
              // Validate and show errors if any
              const errors = await formik.validateForm()
              console.log('Validation errors:', errors)
              if (Object.keys(errors).length > 0) {
                // Mark all fields as touched to show errors
                Object.keys(formik.values).forEach((field) => {
                  formik.setFieldTouched(field, true)
                })
                e.preventDefault()
              }
            }}
            startIcon={
              isSignupLoading ? (
                <AutorenewIcon sx={{ animation: 'spin 1s linear infinite' }} />
              ) : null
            }
          >
            {isSignupLoading ? 'Creating account...' : 'Create account'}
          </Button>

          <Box sx={{ position: 'relative', my: 3 }}>
            <Divider />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'background.paper',
                px: 2,
              }}
            >
              Or continue with
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 6 }}>
              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
                Google
              </Button>
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
                Facebook
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/auth/login">
                <Typography component="span" variant="body2" color="primary" fontWeight="medium">
                  Log in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Creating your account…</DialogTitle>
        <DialogContent>Please wait while we set things up.</DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Container>
  )
}

export default SignupPage
