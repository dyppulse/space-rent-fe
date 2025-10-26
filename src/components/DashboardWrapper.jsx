import { useAuth } from '../contexts/AuthContext'
import DashboardPage from '../pages/DashboardPage'
import ClientDashboardPage from '../pages/ClientDashboardPage'

function DashboardWrapper() {
  const { user } = useAuth()

  // Use activeRole instead of role to respect role switching
  if (user?.activeRole === 'client') {
    return <ClientDashboardPage />
  }

  // Otherwise, show owner dashboard
  return <DashboardPage />
}

export default DashboardWrapper
