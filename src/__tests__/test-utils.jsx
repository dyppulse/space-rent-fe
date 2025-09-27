import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryProvider } from '../providers/QueryProvider'
import { AuthProvider } from '../contexts/AuthContext'

export function renderWithProviders(
  ui,
  { route = '/', themeMode = 'light', ...renderOptions } = {}
) {
  window.history.pushState({}, 'Test page', route)

  const theme = createTheme({ palette: { mode: themeMode } })

  function Wrapper({ children }) {
    return (
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>{children}</BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}
