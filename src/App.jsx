import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './redux/store';

// Pages
import HomePage from './pages/HomePage';
import SpacesPage from './pages/SpacesPage';
import SpaceDetailPage from './pages/SpaceDetailPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NewSpacePage from './pages/NewSpacePage';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import EditSpace from './pages/EditSpace';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d9488', // teal-600
      light: '#14b8a6', // teal-500
      dark: '#0f766e', // teal-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5f5f5', // light gray
      contrastText: '#0d9488',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <Header />

            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spaces" element={<SpacesPage />} />
                <Route path="/spaces/:id" element={<SpaceDetailPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<SignupPage />} />
                <Route path='/dashboard/spaces/:id/edit'
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
      </ThemeProvider>
      </Provider>
  );
}

export default App;
