import { GoogleLogin } from '@react-oauth/google'
import { Box, Alert } from '@mui/material'
import { useState } from 'react'
import { authService } from '../api/services/authService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function GoogleSignInButton() {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleSuccess = async (credentialResponse) => {
    try {
      setError(null)

      // Send credential to backend
      const response = await authService.googleLogin(credentialResponse.credential)

      if (response.user) {
        setUser(response.user)
        navigate(response.user.role === 'superadmin' ? '/admin' : '/dashboard')
      }
    } catch (err) {
      console.error('Google login error:', err)
      setError(err.response?.data?.message || 'Failed to sign in with Google')
    }
  }

  const handleError = () => {
    console.error('Google OAuth error')
    setError('Failed to connect to Google')
  }

  return (
    <Box sx={{ width: '100%' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}

export default GoogleSignInButton
