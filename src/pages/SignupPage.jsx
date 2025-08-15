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
import { useFormik } from 'formik'
import * as yup from 'yup'
import PhoneInputFormik from '../components/PhoneInput'
import { useDispatch, useSelector } from 'react-redux'
import { signUp } from '../redux/slices/authSlice'
import { useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material'
import { useState } from 'react'

function SignupPage() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, signUpError } = useSelector((state) => state?.auth)

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
      .matches(/^\d+$/, 'Phone number must be digits only')
      .test('e164-length', 'Invalid phone number', function (value) {
        const { country } = this.parent || {}
        const dial = (country?.phone || '').replace(/\D/g, '')
        const local = (value || '').replace(/\D/g, '')
        const total = `${dial}${local}`
        return total.length >= 8 && total.length <= 15
      }),
  })

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      country: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const dial = values?.country?.phone || ''
      const local = (values?.phoneNumber || '').replace(/\D/g, '')
      const combined = `${dial}${local}`
      const e164 = combined.startsWith('+') ? combined : `+${combined}`
      dispatch(
        signUp({
          name: values?.fullName,
          email: values?.email,
          password: values?.password,
          phone: e164,
        })
      )
    },
  })

  useEffect(() => {
    if (loading) {
      setOpen(true)
      return
    }
    setOpen(false)
    if (signUpError) {
      setToast({
        open: true,
        message: String(signUpError || 'Failed to create account'),
        severity: 'error',
      })
    } else if (!signUpError) {
      navigate('/dashboard')
      setToast({ open: true, message: 'Account created successfully!', severity: 'success' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, signUpError])

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create an account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up as a space owner to list your venue on our platform
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            size="small"
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formik.values.fullName}
            onChange={(e) => formik.setFieldValue('fullName', e.target.value)}
            helperText={formik.errors.fullName}
            error={formik.errors.fullName}
          />
          <PhoneInputFormik formik={formik} formikValue={'phoneNumber'} />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={(e) => formik.setFieldValue('email', e.target.value)}
            helperText={formik.errors.email}
            error={formik.errors.email}
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
            helperText={formik.errors.password}
            error={formik.errors.password}
            value={formik.values.password}
            onChange={(e) => formik.setFieldValue('password', e.target.value)}
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
            helperText={formik.errors.confirmPassword}
            error={formik.errors.confirmPassword}
            value={formik.values.confirmPassword}
            onChange={(e) => formik.setFieldValue('confirmPassword', e.target.value)}
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
            disabled={loading}
            startIcon={loading ? <CircularProgress color="inherit" size={18} /> : null}
          >
            Create account
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
      <Dialog open={open && !signUpError} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Creating your account…</DialogTitle>
        <DialogContent>Please wait while we set things up.</DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Container>
  )
}

export default SignupPage
