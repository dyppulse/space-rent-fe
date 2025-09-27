import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../components/PrivateRoute'

const authState = { user: null, isLoading: false, initialized: true }
vi.mock('../../contexts/AuthContext', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useAuth: () => authState,
  }
})

describe('PrivateRoute', () => {
  beforeEach(() => {
    authState.user = null
    authState.isLoading = false
    authState.initialized = true
  })
  it('redirects to login if not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/auth/login" element={<div>Login</div>} />
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    authState.user = { id: 'u1' }
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Protected')).toBeInTheDocument()
  })

  it('shows loader when initializing', () => {
    authState.user = null
    authState.isLoading = false
    authState.initialized = false
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
