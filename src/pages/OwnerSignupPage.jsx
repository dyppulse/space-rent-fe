import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { useFormik } from 'formik'
import * as yup from 'yup'
import PhoneInputFormik from '../components/PhoneInput'
import { useAuth } from '../contexts/AuthContext'
import { Snackbar, Alert, FormControlLabel, Checkbox } from '@mui/material'
import { useState } from 'react'

function OwnerSignupPage() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const { signupOwner, isSignupOwnerLoading } = useAuth()

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
    phoneNumber: yup
      .string()
      .required('Required')
      .test('is-valid-phone', 'Please enter a valid phone number', (value) => {
        if (!value) return false
        return value.startsWith('+') && value.length > 10
      }),
  })

  const handleSignup = async (values) => {
    try {
      await signupOwner({
        name: values?.fullName,
        email: values?.email,
        password: values?.password,
        phone: values.phoneNumber,
      })

      // Show success message and redirect to a pending verification page
      navigate('/signup/pending-verification')
    } catch (error) {
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
    },
    validationSchema,
    onSubmit: handleSignup,
  })

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Become a Space Owner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up to list and manage your spaces on our platform
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            size="small"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={formik.values.fullName}
            onChange={(e) => formik.setFieldValue('fullName', e.target.value)}
            onBlur={formik.handleBlur}
            helperText={formik.errors.fullName}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          />

          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: 'text.secondary', fontSize: '0.875rem' }}
            >
              Phone Number
            </Typography>
            <PhoneInputFormik
              formik={formik}
              formikValue="phoneNumber"
              defaultCountry="UG"
              size="small"
            />
          </Box>

          <TextField
            margin="normal"
            size="small"
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={(e) => formik.setFieldValue('email', e.target.value)}
            onBlur={formik.handleBlur}
            helperText={formik.errors.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />

          <TextField
            margin="normal"
            size="small"
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={formik.values.password}
            onChange={(e) => formik.setFieldValue('password', e.target.value)}
            onBlur={formik.handleBlur}
            helperText={formik.errors.password}
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
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={(e) => formik.setFieldValue('confirmPassword', e.target.value)}
            onBlur={formik.handleBlur}
            helperText={formik.errors.confirmPassword}
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
            disabled={isSignupOwnerLoading}
            startIcon={
              isSignupOwnerLoading ? (
                <AutorenewIcon sx={{ animation: 'spin 1s linear infinite' }} />
              ) : null
            }
          >
            {isSignupOwnerLoading ? 'Creating account...' : 'Sign up as Owner'}
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/auth/login">
                <Typography component="span" variant="body2" color="primary" fontWeight="medium">
                  Log in
                </Typography>
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Want to book spaces instead?{' '}
              <Link to="/auth/signup">
                <Typography component="span" variant="body2" color="primary" fontWeight="medium">
                  Sign up as Client
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
    </Container>
  )
}

export default OwnerSignupPage
