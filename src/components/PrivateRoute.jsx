import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoute = ({ children, redirectTo = '/auth/login' }) => {
  const { user, isLoading, initialized } = useAuth()

  // Show loading only during initial auth check and when we don't have a definitive user state
  if (isLoading || (!initialized && user === null)) {
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

  // If user is authenticated, show the protected content
  if (user) {
    return children
  }

  // If not authenticated, redirect to the specified path
  return <Navigate to={redirectTo} replace />
}

export default PrivateRoute
