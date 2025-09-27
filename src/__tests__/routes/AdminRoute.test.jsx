import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminRoute from '../../components/AdminRoute'
import { render } from '@testing-library/react'

const authState = { user: { role: 'user' }, isLoading: false, initialized: true }
vi.mock('../../contexts/AuthContext', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useAuth: () => authState,
  }
})

describe('AdminRoute', () => {
  beforeEach(() => {
    authState.user = { role: 'user' }
    authState.isLoading = false
    authState.initialized = true
  })
  it('redirects non-admin to login', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/auth/login" element={<div>Login</div>} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('shows loader when initializing', () => {
    authState.isLoading = true
    authState.initialized = false
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders children for admin user', () => {
    authState.user = { role: 'superadmin' }
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
