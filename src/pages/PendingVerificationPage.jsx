import { Link } from 'react-router-dom'
import { Box, Container, Typography, Paper, Button, Alert } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EmailIcon from '@mui/icons-material/Email'
import ClockIcon from '@mui/icons-material/AccessTime'

function PendingVerificationPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Account Created Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your owner account is pending verification
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EmailIcon />
              <Typography variant="body2" fontWeight="medium">
                Check Your Email
              </Typography>
            </Box>
            <Typography variant="body2">
              We've sent you an email with verification instructions. Please check your inbox and
              verify your email address.
            </Typography>
          </Alert>

          <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
              <ClockIcon sx={{ color: 'warning.main', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  What Happens Next?
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Our team will review your application within <strong>2 business days</strong> and
                  notify you once your account is verified.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Once approved, you'll be able to switch between client and owner views, list your
                  spaces, and manage bookings.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              What You Can Do Now
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
              <li>Verify your email address using the link we sent</li>
              <li>Continue using the platform as a client to book spaces</li>
              <li>Explore the platform and see how it works</li>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            <Button variant="contained" component={Link} to="/dashboard" fullWidth size="large">
              Go to Dashboard
            </Button>
            <Button variant="outlined" component={Link} to="/spaces" fullWidth size="large">
              Browse Spaces
            </Button>
            <Button variant="text" component={Link} to="/auth/login" fullWidth>
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default PendingVerificationPage
