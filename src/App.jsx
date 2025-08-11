import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import store from './redux/store'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

// Pages
import HomePage from './pages/HomePage'
import SpacesPage from './pages/SpacesPage'
import SpaceDetailPage from './pages/SpaceDetailPage'
import HowItWorksPage from './pages/HowItWorksPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import NewSpacePage from './pages/NewSpacePage'
import NotFound from './pages/NotFound'

// Components
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import EditSpace from './pages/EditSpace'

function useMode() {
  const getInitial = () => {
    const saved = localStorage.getItem('theme-mode')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  const [mode, setMode] = useState(getInitial)
  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
    document.documentElement.setAttribute('data-color-scheme', mode)
  }, [mode])
  return { mode, setMode }
}

function buildTheme(mode) {
  const isDark = mode === 'dark'
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF385C',
        light: '#FF6B82',
        dark: '#E11D48',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#EAEAEA' : '#222222',
        light: isDark ? '#FFFFFF' : '#3C3C3C',
        dark: isDark ? '#C7C7C7' : '#000000',
        contrastText: isDark ? '#000000' : '#ffffff',
      },
      background: {
        default: isDark ? '#141414' : '#ffffff',
        paper: isDark ? '#1A1A1A' : '#ffffff',
      },
      text: {
        primary: isDark ? '#FFFFFF' : '#222222',
        secondary: isDark ? '#B0B0B0' : '#717171',
      },
      divider: isDark ? 'rgba(255,255,255,0.12)' : '#EAEAEA',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      button: { textTransform: 'none' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark ? '#1F1F1F' : '#fff',
            transition: 'box-shadow 120ms ease, border-color 120ms ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e0e0e0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255,255,255,0.35)' : '#9e9e9e',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF385C',
              boxShadow: isDark
                ? '0 0 0 3px rgba(255, 56, 92, 0.2)'
                : '0 0 0 3px rgba(255, 56, 92, 0.15)',
            },
          },
          input: { padding: '14px 14px' },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 16px' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.06)',
            backgroundColor: isDark ? '#1A1A1A' : '#fff',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1A1A1A' : '#fff',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: isDark ? '#1A1A1A' : '#fff',
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1A1A1A' : '#fff',
          },
        },
      },
    },
  })
}

function App() {
  const { mode, setMode } = useMode()
  const theme = useMemo(() => buildTheme(mode), [mode])
  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <div className="app">
              <Header onToggleTheme={toggleTheme} mode={mode} />

              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/spaces" element={<SpacesPage />} />
                  <Route path="/spaces/:id" element={<SpaceDetailPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/signup" element={<SignupPage />} />
                  <Route
                    path="/dashboard/spaces/:id/edit"
                    element={
                      <PrivateRoute>
                        <EditSpace />
                      </PrivateRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard/spaces/new"
                    element={
                      <PrivateRoute>
                        <NewSpacePage />
                      </PrivateRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
