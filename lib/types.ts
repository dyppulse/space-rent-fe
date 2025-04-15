export interface Space {
  id: string
  name: string
  description: string
  location: string
  price: number
  priceUnit: string
  type: string
  images: string[]
  amenities: string[]
  capacity: number
  featured?: boolean
  rating?: number
  ownerId: string
  availability?: {
    startDate: string
    endDate: string
    excludedDates?: string[]
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: "owner" | "admin"
  createdAt: string
}

export interface Booking {
  id: string
  spaceId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  eventDate: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  totalPrice: number
  notes?: string
}
