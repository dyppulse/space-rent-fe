import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    let mounted = true
    const checkAuth = async () => {
      try {
        await axiosInstance.get('/auth/me')
        if (mounted) setIsAuthenticated(true)
      } catch (_e) {
        console.error(_e)
        if (mounted) setIsAuthenticated(false)
      }
    }
    checkAuth()
    return () => {
      mounted = false
    }
  }, [])

  if (isAuthenticated === null) return null
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />
}

export default PrivateRoute
