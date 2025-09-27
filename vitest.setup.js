import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup DOM after each test
afterEach(() => {
  cleanup()
})

// Polyfill matchMedia used in theme detection
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// Silence React Query Devtools warnings in tests
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}))

// Mock window.location.replace to avoid navigation crashes
if (typeof window !== 'undefined') {
  delete window.location
  window.location = { ...new URL('http://localhost/'), replace: vi.fn() }
}
