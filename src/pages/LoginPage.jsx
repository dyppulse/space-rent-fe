import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const { formik, loading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Log in to your account Log in to your account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your email and password to access your space owner dashboard
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            margin="normal"
            size="small"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body2" component="label" htmlFor="password">
              Password
            </Typography>
            <Link to="/auth/forgot-password">
              <Typography variant="body2" color="primary">
                Forgot password?
              </Typography>
            </Link>
          </Box>

          <TextField
            fullWidth
            margin="normal"
            size="small"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            // disabled={formik.isSubmitting || isLoading}
            disabled={loading}
            startIcon={loading ? <CircularProgress color="inherit" size={18} /> : null}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error || 'Login failed. Please try again.'}
            </Typography>
          )}

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
              Don't have an account?{' '}
              <Link to="/auth/signup">
                <Typography component="span" variant="body2" color="primary" fontWeight="medium">
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage
