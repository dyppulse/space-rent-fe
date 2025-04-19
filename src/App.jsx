import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Pages
import HomePage from "./pages/HomePage"
import SpacesPage from "./pages/SpacesPage"
import SpaceDetailPage from "./pages/SpaceDetailPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import NewSpacePage from "./pages/NewSpacePage"
import HowItWorksPage from "./pages/HowItWorksPage"

// Layout
// import Layout from "./components/Layout"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#14b8a6", // teal-500
      dark: "#0f766e", // teal-700
      light: "#5eead4", // teal-300
      contrastText: "#fff",
    },
    secondary: {
      main: "#f5f5f5", // gray-100
      dark: "#e5e5e5", // gray-200
      contrastText: "#111827", // gray-900
    },
    error: {
      main: "#ef4444", // red-500
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
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
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* <Layout> */}
          <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/spaces" element={<SpacesPage />} />
            <Route path="/spaces/:id" element={<SpaceDetailPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/spaces/new" element={<NewSpacePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Routes>
        {/* </Layout> */}
      </Router>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  )
}

export default App
