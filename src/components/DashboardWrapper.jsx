import { useAuth } from '../contexts/AuthContext'
import DashboardPage from '../pages/DashboardPage'
import ClientDashboardPage from '../pages/ClientDashboardPage'

function DashboardWrapper() {
  const { user } = useAuth()

  // If user is a client, show client dashboard
  if (user?.role === 'client') {
    return <ClientDashboardPage />
  }

  // Otherwise, show owner dashboard
  return <DashboardPage />
}

export default DashboardWrapper
