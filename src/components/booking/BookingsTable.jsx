import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'

function BookingsTable({ bookings, onBookingAction, isLoading }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget)
    setSelectedBooking(booking)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedBooking(null)
  }

  const handleAction = (action) => {
    if (selectedBooking) {
      onBookingAction(selectedBooking, action)
    }
    handleMenuClose()
  }

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Pending' },
      confirmed: { color: 'success', label: 'Confirmed' },
      declined: { color: 'error', label: 'Declined' },
      completed: { color: 'info', label: 'Completed' },
      cancelled: { color: 'default', label: 'Cancelled' },
    }

    const config = statusConfig[status] || { color: 'default', label: status }
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />
  }

  const formatDate = (date) => {
    if (!date) return 'Not specified'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (time) => {
    if (!time) return 'Not specified'
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount) => {
    return `$${amount?.toFixed(2) || '0.00'}`
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading bookings...</Typography>
      </Box>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No bookings found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You haven't made any bookings yet.
        </Typography>
      </Box>
    )
  }

  const paginatedBookings = bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Space</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    #{booking.id.slice(-8)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {getInitials(booking.space?.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {booking.space?.name || 'Unknown Space'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.space?.location?.address || 'No address'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{formatDate(booking.eventDate)}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {booking.startTime && booking.endTime
                      ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
                      : 'Full day'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{booking.guests} people</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(booking.totalPrice)}
                  </Typography>
                </TableCell>

                <TableCell>{getStatusChip(booking.status)}</TableCell>

                <TableCell>
                  <Tooltip title="More actions">
                    <IconButton onClick={(e) => handleMenuClick(e, booking)} size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={bookings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        {selectedBooking?.status === 'pending' && (
          <>
            <MenuItem onClick={() => handleAction('accept')}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Accept Booking</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction('decline')} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <CancelIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Decline Booking</ListItemText>
            </MenuItem>
          </>
        )}

        {selectedBooking?.status === 'confirmed' && (
          <MenuItem onClick={() => handleAction('cancel')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancel Booking</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Booking</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default BookingsTable
