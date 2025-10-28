import { useSearchParams, Link } from 'react-router-dom'
import { Box, Container, Typography, Paper, Button, Alert, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useQuery } from '@tanstack/react-query'
import { authService } from '../api/services/authService'

function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const { data, isLoading, error } = useQuery({
    queryKey: ['email-verification', token],
    queryFn: () => authService.verifyEmail(token),
    enabled: !!token,
    retry: false,
  })

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Invalid Verification Link
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The verification link is invalid or has expired.
            </Typography>
            <Button variant="contained" component={Link} to="/auth/login" sx={{ mt: 2 }}>
              Go to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={80} sx={{ mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom>
              Verifying Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we verify your email address...
            </Typography>
          </Box>
        </Paper>
      </Container>
    )
  }

  if (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Verification failed'

    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
              {errorMessage}
            </Alert>
            <Typography variant="body2" color="text.secondary" paragraph>
              The verification link may have expired or already been used.
            </Typography>
            <Button variant="contained" component={Link} to="/auth/login" sx={{ mt: 2 }}>
              Go to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    )
  }

  if (data) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Email Verified!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your email address has been successfully verified.
            </Typography>
            <Button variant="contained" component={Link} to="/auth/login" sx={{ mt: 2 }}>
              Go to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    )
  }

  return null
}

export default EmailVerificationPage
