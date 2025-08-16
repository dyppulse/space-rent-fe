// Query keys for React Query cache management
export const queryKeys = {
  // Auth related queries
  auth: {
    all: ['auth'],
    user: () => [...queryKeys.auth.all, 'user'],
    status: () => [...queryKeys.auth.all, 'status'],
  },

  // Spaces related queries
  spaces: {
    all: ['spaces'],
    lists: () => [...queryKeys.spaces.all, 'list'],
    list: (filters) => [...queryKeys.spaces.lists(), filters],
    details: () => [...queryKeys.spaces.all, 'detail'],
    detail: (id) => [...queryKeys.spaces.details(), id],
    mySpaces: () => [...queryKeys.spaces.all, 'my-spaces'],
  },

  // Bookings related queries
  bookings: {
    all: ['bookings'],
    lists: () => [...queryKeys.bookings.all, 'list'],
    list: (filters) => [...queryKeys.bookings.lists(), filters],
    details: () => [...queryKeys.bookings.all, 'detail'],
    detail: (id) => [...queryKeys.bookings.details(), id],
    owner: () => [...queryKeys.bookings.all, 'owner'],
    stats: () => [...queryKeys.bookings.all, 'stats'],
  },

  // Admin related queries
  admin: {
    all: ['admin'],
    users: () => [...queryKeys.admin.all, 'users'],
    spaces: () => [...queryKeys.admin.all, 'spaces'],
    bookings: () => [...queryKeys.admin.all, 'bookings'],
    locations: () => [...queryKeys.admin.all, 'locations'],
    taxonomies: () => [...queryKeys.admin.all, 'taxonomies'],
  },
}
