import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const SmartRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { user } = useSelector((state) => state.auth)

  // If user is logged in, redirect based on role
  if (user) {
    if (user.role === 'superadmin') {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to={redirectTo} replace />
    }
  }

  // If not logged in, show the intended component (usually home page)
  return children
}

export default SmartRoute
