import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Skeleton,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Event as EventIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../api/axiosInstance'

const BookingForm = ({ open, onClose, onSubmit, initialValues, isEditing }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      status: 'pending',
      eventDate: '',
      startTime: '',
      endTime: '',
      totalPrice: '',
      notes: '',
    },
    validationSchema: Yup.object({
      status: Yup.string().oneOf(['pending', 'confirmed', 'cancelled'], 'Invalid status'),
      eventDate: Yup.date().required('Event date is required'),
      startTime: Yup.string().required('Start time is required'),
      endTime: Yup.string().required('End time is required'),
      totalPrice: Yup.number()
        .positive('Price must be positive')
        .required('Total price is required'),
    }),
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  useEffect(() => {
    if (open && initialValues) {
      formik.setValues(initialValues)
    }
  }, [open, initialValues, formik])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Booking' : 'View Booking Details'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Status"
                  error={formik.touched.status && Boolean(formik.errors.status)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="eventDate"
                label="Event Date"
                type="date"
                value={formik.values.eventDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                helperText={formik.touched.eventDate && formik.errors.eventDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="startTime"
                label="Start Time"
                type="time"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                helperText={formik.touched.startTime && formik.errors.startTime}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="endTime"
                label="End Time"
                type="time"
                value={formik.values.endTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="totalPrice"
                label="Total Price"
                type="number"
                value={formik.values.totalPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.totalPrice && Boolean(formik.errors.totalPrice)}
                helperText={formik.touched.totalPrice && formik.errors.totalPrice}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {isEditing && (
          <Button onClick={formik.submitForm} variant="contained" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchBookings()
  }, [page, rowsPerPage, search, statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      })
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)

      const response = await axiosInstance.get(`/admin/bookings?${params}`)
      setBookings(response.data.bookings)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      showSnackbar('Error fetching bookings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBooking = async (bookingData) => {
    try {
      await axiosInstance.patch(`/admin/bookings/${editingBooking.id}`, bookingData)
      setFormOpen(false)
      setEditingBooking(null)
      showSnackbar('Booking updated successfully', 'success')
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      showSnackbar(error.response?.data?.message || 'Error updating booking', 'error')
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (
      !window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')
    ) {
      return
    }

    try {
      await axiosInstance.delete(`/admin/bookings/${bookingId}`)
      showSnackbar('Booking deleted successfully', 'success')
      fetchBookings()
    } catch (error) {
      console.error('Error deleting booking:', error)
      showSnackbar(error.response?.data?.message || 'Error deleting booking', 'error')
    }
  }

  const handleEditBooking = (booking) => {
    setEditingBooking(booking)
    setFormOpen(true)
  }

  const handleViewBooking = (booking) => {
    setEditingBooking(booking)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingBooking(null)
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading && bookings.length === 0) {
    return (
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={60} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">Bookings Management</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage all platform bookings and reservations
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4">
                {bookings.filter((b) => b.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Confirmed
              </Typography>
              <Typography variant="h4">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cancelled
              </Typography>
              <Typography variant="h4">
                {bookings.filter((b) => b.status === 'cancelled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by client name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Space</TableCell>
                <TableCell>Event Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{booking.client?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {booking.client?.email || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{booking.space?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {booking.space?.location?.district || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(booking.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {booking.startTime} - {booking.endTime}
                  </TableCell>
                  <TableCell>${booking.totalPrice}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleViewBooking(booking)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditBooking(booking)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteBooking(booking.id)}
                      color="error"
                      disabled={booking.status === 'confirmed'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Booking Form Dialog */}
      <BookingForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleUpdateBooking}
        initialValues={editingBooking}
        isEditing={!!editingBooking}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default BookingsPage
