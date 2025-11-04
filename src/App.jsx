import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useState, useEffect } from 'react'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeContext } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import SpacesPage from './pages/SpacesPage'
import SpaceDetailPage from './pages/SpaceDetailPage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
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
import UpgradeRequestsPage from './pages/admin/UpgradeRequestsPage'
import './App.css'

// Create theme with system preference detection
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#238636' : '#4caf50',
      light: '#51c765',
      dark: '#1a5f28',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#238636',
      light: '#51c765',
      dark: '#1a5f28',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196f3',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#fafbfc' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#fff',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
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
          ...(mode === 'light' && {
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          color: '#ffffff !important',
          '&:hover': {
            backgroundColor: '#1a5f28 !important',
          },
        },
        containedPrimary: {
          backgroundColor: mode === 'light' ? '#238636' : '#4caf50',
          color: '#ffffff !important',
          '&:hover': {
            backgroundColor: '#1a5f28 !important',
          },
        },
        containedSuccess: {
          backgroundColor: '#238636',
          color: '#ffffff !important',
          '&:hover': {
            backgroundColor: '#1a5f28 !important',
          },
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
  const isSpacesRoute = location.pathname === '/spaces' || location.pathname.startsWith('/spaces/')

  return (
    <div className="App">
      {!isAdminRoute && !isSpacesRoute && <Header onToggleTheme={toggleTheme} mode={mode} />}
      <main style={{ marginTop: isAdminRoute ? 0 : 'auto' }}>
        <Routes>
          {/* Root redirect to spaces */}
          <Route path="/" element={<Navigate to="/spaces" replace />} />

          {/* Public Routes */}
          <Route path="/spaces" element={<SpacesPage onToggleTheme={toggleTheme} mode={mode} />} />
          <Route path="/spaces/:id" element={<SpaceDetailPage />} />

          {/* Auth Routes - Admin login only */}
          <Route
            path="/auth/login"
            element={
              <SmartRoute redirectTo="/spaces">
                <LoginPage />
              </SmartRoute>
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
            <Route path="upgrade-requests" element={<UpgradeRequestsPage />} />
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
