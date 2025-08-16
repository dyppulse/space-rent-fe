import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, isLoading, initialized } = useAuth()

  // Show loading only during initial auth check
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

  // If user is admin, show the admin content
  if (user && user.role === 'superadmin') {
    return children
  }

  // If not admin, redirect to login
  return <Navigate to="/auth/login" replace />
}

export default AdminRoute
