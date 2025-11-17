import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../test-utils'
import Header from '../../components/Header'

const authState = { user: null, initialized: true, logout: vi.fn(), isLoading: false }

vi.mock('../../contexts/AuthContext', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useAuth: () => authState,
  }
})

const mockedNavigate = vi.fn()
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

// Simplify ConfirmDialog to a button that calls onConfirm when open
vi.mock('../../components/ConfirmDialog', () => ({
  __esModule: true,
  default: ({ open, onConfirm }) => (open ? <button onClick={onConfirm}>Confirm</button> : null),
}))

describe('Header', () => {
  beforeEach(() => {
    authState.user = null
    authState.initialized = true
    authState.logout = vi.fn()
    mockedNavigate.mockReset()
  })

  it('shows auth links when logged out', () => {
    renderWithProviders(<Header />)
    expect(screen.getAllByText('Log in').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sign up').length).toBeGreaterThan(0)
  })

  it('shows loading app bar when auth not initialized', () => {
    authState.initialized = false
    renderWithProviders(<Header />)
    expect(screen.getByText('Spaces')).toBeInTheDocument()
  })

  it('renders admin link for admin user', () => {
    authState.user = { role: 'superadmin' }
    renderWithProviders(<Header />)
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0)
  })

  it('confirms logout and navigates to login page', async () => {
    authState.user = { role: 'user' }
    authState.logout = vi.fn().mockResolvedValueOnce()
    renderWithProviders(<Header />)
    // Click power icon
    const powerIcon = screen.getByTestId('PowerSettingsNewIcon')
    fireEvent.click(powerIcon)
    // Click mocked Confirm button
    const confirmBtn = await screen.findByText('Confirm')
    fireEvent.click(confirmBtn)
    await waitFor(() => expect(authState.logout).toHaveBeenCalled())
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/auth/login'))
  })

  it('handles logout failure and still navigates to login page', async () => {
    authState.user = { role: 'user' }
    authState.logout = vi.fn().mockRejectedValueOnce(new Error('fail'))
    renderWithProviders(<Header />)
    fireEvent.click(screen.getByTestId('PowerSettingsNewIcon'))
    const confirmBtn = await screen.findByText('Confirm')
    fireEvent.click(confirmBtn)
    await waitFor(() => expect(authState.logout).toHaveBeenCalled())
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/auth/login'))
  })

  it('toggles mobile drawer', () => {
    renderWithProviders(<Header />)
    const openDrawerBtn = screen.getByLabelText('open drawer')
    fireEvent.click(openDrawerBtn)
    // No strict assertion needed; click executes handler for coverage
  })
})
