import React from 'react'
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../test-utils'

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return { ...actual, useNavigate: () => navigateMock }
})

let HomePage
beforeAll(async () => {
  HomePage = (await import('../../pages/HomePage')).default
})

beforeEach(() => {
  navigateMock.mockReset()
})

let spacesLoading = false
vi.mock('../../api/queries/spaceQueries', () => ({
  useSpaces: () => ({ data: { spaces: [] }, isLoading: spacesLoading }),
}))

let authLoading = false
vi.mock('../../contexts/AuthContext', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useAuth: () => ({ isLoading: authLoading }),
  }
})

describe('HomePage', () => {
  it('renders CTA and SpaceGrid', () => {
    spacesLoading = false
    authLoading = false
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Available Spaces')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /List Your Space/i })).toBeInTheDocument()
  })

  it('navigates to new space on CTA click', () => {
    spacesLoading = false
    authLoading = false
    renderWithProviders(<HomePage />)
    fireEvent.click(screen.getByRole('button', { name: /List Your Space/i }))
    expect(navigateMock).toHaveBeenCalledWith('/dashboard/spaces/new')
  })

  it('disables CTA while auth is loading', () => {
    authLoading = true
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('button', { name: /Loading.../i })).toBeDisabled()
    authLoading = false
  })
})
