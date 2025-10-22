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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box as MuiBox,
  Alert,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import EmailIcon from '@mui/icons-material/Email'
import AppleIcon from '@mui/icons-material/Apple'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { useAuth } from '../hooks/useAuth'
import GoogleSignInButton from '../components/GoogleSignInButton'

function LoginPage() {
  const { formik, isLoginLoading, loginError, clearLoginError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          width: '100%',
          maxWidth: 560,
          mx: 'auto',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? '#000' : 'divider',
        })}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Log in or sign up
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to SpaceHire
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <Box
              sx={(theme) => ({
                border: '1px solid',
                borderColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[400]
                    : theme.palette.grey[600],
                borderRadius: 1,
                overflow: 'hidden',
              })}
            >
              <TextField
                fullWidth
                placeholder="Email"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputProps={{
                  sx: {
                    px: 1.5,
                    py: 1,
                    minHeight: 48,
                    '& .MuiInputBase-input': { py: 0.75 },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    borderRadius: 0,
                  },
                }}
              />
              <Box
                sx={(theme) => ({
                  borderTop: '1px solid',
                  borderColor:
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[400]
                      : theme.palette.grey[600],
                })}
              />
              <TextField
                fullWidth
                placeholder="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                  sx: {
                    px: 1.5,
                    py: 1,
                    minHeight: 48,
                    '& .MuiInputBase-input': { py: 0.75 },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    borderRadius: 0,
                  },
                }}
              />
            </Box>

            {(formik.touched.email && formik.errors.email) ||
            (formik.touched.password && formik.errors.password) ? (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : formik.errors.password}
              </Typography>
            ) : null}

            {loginError && (
              <Alert severity="error" sx={{ mt: 1 }} onClose={clearLoginError}>
                {loginError}
              </Alert>
            )}

            <MuiBox
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}
            >
              <Link to="/auth/forgot-password">
                <Typography variant="body2" color="primary">
                  Forgot password?
                </Typography>
              </Link>
            </MuiBox>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, mb: 1 }}
              disabled={isLoginLoading}
              startIcon={
                isLoginLoading ? (
                  <AutorenewIcon sx={{ animation: 'spin 1s linear infinite' }} />
                ) : null
              }
            >
              {isLoginLoading ? 'Signing in...' : 'Continue'}
            </Button>
          </Box>

          <Box sx={{ position: 'relative', my: 2 }}>
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

          <Box sx={{ mb: 2 }}>
            <GoogleSignInButton />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            By continuing, you agree to our Terms of Service and acknowledge our Privacy Policy.
          </Typography>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
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
