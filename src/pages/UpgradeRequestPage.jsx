import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../api/services/authService'
import { Snackbar } from '@mui/material'

function UpgradeRequestPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const upgradeMutation = useMutation({
    mutationFn: () => authService.submitUpgradeRequest({}),
    onSuccess: () => {
      // Invalidate both user and status queries to update the user object everywhere
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      setSnackbar({
        open: true,
        message: 'Upgrade request submitted successfully!',
        severity: 'success',
      })
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to submit upgrade request'
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      })
    },
  })

  const handleSubmit = () => {
    upgradeMutation.mutate()
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <BusinessIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Become a Space Owner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Request to list and manage your spaces on our platform
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Upgrade your account to become a space owner and start listing your venues. Our team
              will review your request within <strong>2 business days</strong>.
            </Typography>
          </Alert>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <CheckCircleIcon color="primary" />
                What you'll get
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    List unlimited spaces and venues
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Manage bookings and availability
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Switch between client and owner views
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Access detailed analytics and insights
                  </Typography>
                </li>
              </Box>
            </CardContent>
          </Card>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> After submitting your request, you'll continue using the
              platform as a client until your request is approved by our admin team.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              disabled={upgradeMutation.isPending}
              startIcon={
                upgradeMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <BusinessIcon />
                )
              }
            >
              {upgradeMutation.isPending ? 'Submitting...' : 'Submit Upgrade Request'}
            </Button>
            <Button variant="outlined" component={Link} to="/dashboard" fullWidth size="large">
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default UpgradeRequestPage
