import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const SmartRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { user } = useSelector((state) => state.auth)

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  // If not logged in, show the intended component (usually home page)
  return children
}

export default SmartRoute
