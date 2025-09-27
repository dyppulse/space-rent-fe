import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test-utils'
import SpaceCard from '../../components/SpaceCard'

const sampleSpace = {
  id: '1',
  name: 'Conference Hall',
  description: 'Large, modern hall',
  images: [{ url: '/img.jpg' }],
  amenities: ['Wifi', 'Parking', 'AC', 'Projector'],
  price: { amount: 1000, unit: 'day' },
  location: { address: 'Main St' },
  spaceType: 'hall',
  featured: true,
  rating: 4.5,
}

describe('SpaceCard', () => {
  it('renders name, price and link', () => {
    renderWithProviders(<SpaceCard space={sampleSpace} />)
    expect(screen.getByText('Conference Hall')).toBeInTheDocument()
    expect(screen.getByText(/UGX 1000/)).toBeInTheDocument()
  })
})
