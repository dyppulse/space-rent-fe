import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useState, useEffect } from 'react'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeContext } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SpacesPage from './pages/SpacesPage'
import SpaceDetailPage from './pages/SpaceDetailPage'
import BookingWizard from './pages/BookingWizard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import NewSpacePage from './pages/NewSpacePage'
import EditSpace from './pages/EditSpace'
import BookingsManagementPage from './pages/BookingsManagementPage'
import HowItWorksPage from './pages/HowItWorksPage'
import NotFound from './pages/NotFound'
import WorkInProgress from './pages/WorkInProgress'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import SmartRoute from './components/SmartRoute'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersPage from './pages/admin/UsersPage'
import AdminSpacesPage from './pages/admin/SpacesPage'
import SpaceTypesPage from './pages/admin/SpaceTypesPage'
import LocationsPage from './pages/admin/LocationsPage'
import AmenitiesPage from './pages/admin/AmenitiesPage'
import BookingsPage from './pages/admin/BookingsPage'
import FeatureFlagsPage from './pages/admin/FeatureFlagsPage'
import './App.css'

// Create theme with system preference detection
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#10b981' : '#6ee7b7',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: mode === 'light' ? '#fafafa' : '#121212',
      paper: mode === 'light' ? '#fff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#fff',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Nunito Sans", "Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

// Detect system preference
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

// Component to conditionally render footer
function AppContent({ toggleTheme, mode }) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="App">
      {!isAdminRoute && <Header onToggleTheme={toggleTheme} mode={mode} />}
      <main style={{ marginTop: isAdminRoute ? 0 : 'auto' }}>
        <Routes>
          {/* Public Routes - Available to all users */}
          <Route path="/" element={<HomePage />} />

          {/* Public Routes - Available to all users */}
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/spaces/:id" element={<SpaceDetailPage />} />
          <Route path="/spaces/:id/book" element={<BookingWizard />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/work-in-progress" element={<WorkInProgress />} />

          {/* Auth Routes - Redirect logged-in users to dashboard */}
          <Route
            path="/auth/login"
            element={
              <SmartRoute redirectTo="/dashboard">
                <LoginPage />
              </SmartRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <SmartRoute redirectTo="/dashboard">
                <SignupPage />
              </SmartRoute>
            }
          />

          {/* Protected Owner Routes */}
          <Route
            path="/dashboard/spaces/new"
            element={
              <PrivateRoute redirectTo="/auth/login">
                <NewSpacePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/spaces/:id/edit"
            element={
              <PrivateRoute redirectTo="/auth/login">
                <EditSpace />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute redirectTo="/auth/login">
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <PrivateRoute redirectTo="/auth/login">
                <BookingsManagementPage />
              </PrivateRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout onToggleTheme={toggleTheme} mode={mode} />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="spaces" element={<AdminSpacesPage />} />
            <Route path="space-types" element={<SpaceTypesPage />} />
            <Route path="amenities" element={<AmenitiesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="feature-flags" element={<FeatureFlagsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light')

  const theme = createTheme(getDesignTokens(mode))

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
  }, [mode])

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode')
    if (savedMode) {
      setMode(savedMode)
    }
  }, [])
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppContent toggleTheme={toggleTheme} mode={mode} />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
