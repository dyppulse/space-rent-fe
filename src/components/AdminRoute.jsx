import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

const AdminRoute = ({ children }) => {
  const [status, setStatus] = useState('checking') // 'checking' | 'allowed' | 'denied'

  useEffect(() => {
    let mounted = true
    const check = async () => {
      try {
        const res = await axiosInstance.get('/auth/me')
        const role = res?.data?.user?.role
        if (mounted) setStatus(role === 'superadmin' ? 'allowed' : 'denied')
      } catch {
        if (mounted) setStatus('denied')
      }
    }
    check()
    return () => {
      mounted = false
    }
  }, [])

  if (status === 'checking') return null
  return status === 'allowed' ? children : <Navigate to="/auth/login" replace />
}

export default AdminRoute
