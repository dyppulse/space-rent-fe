import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const SmartRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { user, isLoading, initialized } = useAuth()

  // Only show loading if we're actively loading AND haven't initialized yet
  // This prevents flickering on subsequent route changes
  if (isLoading && !initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // If user is logged in, redirect based on role
  if (user) {
    if (user.role === 'superadmin') {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to={redirectTo} replace />
    }
  }

  // If not logged in, show the intended component
  return children
}

export default SmartRoute
