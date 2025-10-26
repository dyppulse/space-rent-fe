import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const OwnerOnlyRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { user, isLoading, initialized } = useAuth()

  // Show loading only during initial auth check
  if (isLoading || !initialized) {
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

  // If user is viewing as owner, show the content
  if (user?.activeRole === 'owner') {
    return children
  }

  // If not viewing as owner, redirect to specified path
  return <Navigate to={redirectTo} replace />
}

export default OwnerOnlyRoute
