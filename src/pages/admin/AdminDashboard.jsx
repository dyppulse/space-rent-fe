import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Skeleton,
} from '@mui/material'
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
)

const RecentItem = ({ item, type, onView, onEdit, onDelete, isDeleting = false }) => {
  const getIcon = () => {
    switch (type) {
      case 'space':
        return <BusinessIcon />
      case 'booking':
        return <EventIcon />
      case 'user':
        return <PeopleIcon />
      default:
        return <BusinessIcon />
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'space':
        return item.name
      case 'booking':
        return `${item.client?.name} - ${item.space?.name}`
      case 'user':
        return item.name
      default:
        return 'Unknown'
    }
  }

  const getSubtitle = () => {
    switch (type) {
      case 'space':
        return `${item.location?.district || 'N/A'}, ${item.location?.city || 'N/A'}`
      case 'booking':
        return `${item.status} • ${new Date(item.eventDate).toLocaleDateString()}`
      case 'user':
        return `${item.email} • ${item.role}`
      default:
        return ''
    }
  }

  return (
    <Box
      sx={{
        py: 2,
        px: 2,
        mb: 1,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, mr: 2 }}>{getIcon()}</Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
            {getTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
            {getSubtitle()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
        <IconButton onClick={() => onView(item)} size="small">
          <ViewIcon />
        </IconButton>
        <IconButton onClick={() => onEdit(item)} size="small">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(item)} size="small" color="error" disabled={isDeleting}>
          {isDeleting ? <CircularProgress size={16} color="error" /> : <DeleteIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentSpaces, setRecentSpaces] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [deletingItems, setDeletingItems] = useState(new Set())

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/admin/dashboard')
      setStats(response.data.stats)
      setRecentSpaces(response.data.recentSpaces)
      setRecentBookings(response.data.recentBookings)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearching(true)
      const response = await axiosInstance.get(
        `/admin/search?query=${encodeURIComponent(searchQuery)}`
      )
      setSearchResults(response.data)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleView = (item) => {
    // Navigate to appropriate view page based on item type
    if (item.type === 'space' || item.type === undefined) {
      navigate(`/spaces/${item.id}`)
    } else if (item.type === 'booking') {
      navigate(`/admin/bookings`)
    } else if (item.type === 'user') {
      navigate(`/admin/users`)
    }
  }

  const handleEdit = (item) => {
    // Navigate to appropriate edit page based on item type
    if (item.type === 'space' || item.type === undefined) {
      navigate(`/admin/spaces`)
    } else if (item.type === 'booking') {
      navigate(`/admin/bookings`)
    } else if (item.type === 'user') {
      navigate(`/admin/users`)
    }
  }

  const handleDelete = async (item) => {
    // Show delete confirmation and handle deletion
    const itemName = item.name || item.title || 'item'
    const itemType = item.type || 'space'

    if (
      window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)
    ) {
      try {
        // Set loading state for this specific item
        setDeletingItems((prev) => new Set(prev).add(item.id))

        let endpoint = ''
        if (itemType === 'space' || itemType === undefined) {
          endpoint = `/admin/spaces/${item.id}`
        } else if (itemType === 'booking') {
          endpoint = `/admin/bookings/${item.id}`
        } else if (itemType === 'user') {
          endpoint = `/admin/users/${item.id}`
        }

        if (endpoint) {
          await axiosInstance.delete(endpoint)
          // Show success message
          alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully!`)
          // Refresh dashboard data after successful deletion
          fetchDashboardData()
        }
      } catch (error) {
        console.error('Error deleting item:', error)
        alert(`Failed to delete ${itemType}. Please try again.`)
      } finally {
        // Clear loading state for this item
        setDeletingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(item.id)
          return newSet
        })
      }
    }
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'users':
        navigate('/admin/users')
        break
      case 'spaces':
        navigate('/admin/spaces')
        break
      case 'bookings':
        navigate('/admin/bookings')
        break
      case 'locations':
        navigate('/admin/locations')
        break
      case 'taxonomies':
        navigate('/admin/taxonomies')
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={120} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={120} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={120} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={120} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Overview of platform activity and quick access to management functions
        </Typography>
      </Box>

      {/* Global Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            placeholder="Search across users, spaces, and bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!searchQuery.trim() || searching}
          >
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </Box>

        {searchResults && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            <Grid container spacing={2}>
              {searchResults.users?.length > 0 && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Users ({searchResults.users.length})
                  </Typography>
                  {searchResults.users.map((user) => (
                    <Box
                      key={user.id}
                      p={1}
                      border={1}
                      borderColor="divider"
                      borderRadius={1}
                      mb={1}
                    >
                      <Typography variant="body2">{user.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.email}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              )}
              {searchResults.spaces?.length > 0 && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Spaces ({searchResults.spaces.length})
                  </Typography>
                  {searchResults.spaces.map((space) => (
                    <Box
                      key={space.id}
                      p={1}
                      border={1}
                      borderColor="divider"
                      borderRadius={1}
                      mb={1}
                    >
                      <Typography variant="body2">{space.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {space.location?.district}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              )}
              {searchResults.bookings?.length > 0 && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Bookings ({searchResults.bookings.length})
                  </Typography>
                  {searchResults.bookings.map((booking) => (
                    <Box
                      key={booking.id}
                      p={1}
                      border={1}
                      borderColor="divider"
                      borderRadius={1}
                      mb={1}
                    >
                      <Typography variant="body2">{booking.client?.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.space?.name}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<PeopleIcon />}
            color="primary.main"
            subtitle="Platform users"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Spaces"
            value={stats?.totalSpaces || 0}
            icon={<BusinessIcon />}
            color="success.main"
            subtitle="Available for booking"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            icon={<EventIcon />}
            color="info.main"
            subtitle="All time"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Bookings"
            value={stats?.pendingBookings || 0}
            icon={<TrendingUpIcon />}
            color="warning.main"
            subtitle="Awaiting confirmation"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => handleQuickAction('users')}
            >
              Manage Users
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="outlined"
              startIcon={<BusinessIcon />}
              onClick={() => handleQuickAction('spaces')}
            >
              Manage Spaces
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="outlined"
              startIcon={<EventIcon />}
              onClick={() => handleQuickAction('bookings')}
            >
              Manage Bookings
            </Button>
          </Grid>
          <Grid>
            <Button variant="outlined" onClick={() => handleQuickAction('locations')}>
              Manage Locations
            </Button>
          </Grid>
          <Grid>
            <Button variant="outlined" onClick={() => handleQuickAction('taxonomies')}>
              Manage Taxonomies
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Spaces
            </Typography>
            <List sx={{ py: 1 }}>
              {recentSpaces.map((space) => (
                <RecentItem
                  key={space.id}
                  item={space}
                  type="space"
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingItems.has(space.id)}
                />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <List sx={{ py: 1 }}>
              {recentBookings.map((booking) => (
                <RecentItem
                  key={booking.id}
                  item={booking}
                  type="booking"
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingItems.has(booking.id)}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
