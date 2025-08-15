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
  Switch,
  FormControlLabel,
  TextareaAutosize,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../api/axiosInstance'

const SpaceForm = ({ open, onClose, onSubmit, initialValues, isEditing, owners }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      spaceType: '',
      capacity: '',
      price: '',
      isActive: true,
      owner: '',
      location: {
        address: '',
        city: '',
        state: '',
        district: '',
        county: '',
        subCounty: '',
        parish: '',
        village: '',
        coordinates: {
          lat: '',
          lng: '',
        },
      },
      amenities: [],
      images: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      spaceType: Yup.string().required('Space type is required'),
      capacity: Yup.number().positive('Capacity must be positive').required('Capacity is required'),
      price: Yup.number().positive('Price must be positive').required('Price is required'),
      owner: Yup.string().required('Owner is required'),
      'location.address': Yup.string().required('Address is required'),
      'location.city': Yup.string().required('City is required'),
      'location.state': Yup.string().required('State is required'),
    }),
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  useEffect(() => {
    if (open && initialValues) {
      formik.setValues(initialValues)
    }
  }, [open, initialValues])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Space' : 'Create New Space'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="name"
                label="Space Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Owner</InputLabel>
                <Select
                  name="owner"
                  value={formik.values.owner}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Owner"
                  error={formik.touched.owner && Boolean(formik.errors.owner)}
                >
                  {owners.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="spaceType"
                label="Space Type"
                value={formik.values.spaceType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.spaceType && Boolean(formik.errors.spaceType)}
                helperText={formik.touched.spaceType && formik.errors.spaceType}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="capacity"
                label="Capacity"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="price"
                label="Price per Hour"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            {/* Location Fields */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Location Details
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.address"
                label="Address"
                value={formik.values.location.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched['location.address'] && Boolean(formik.errors['location.address'])
                }
                helperText={formik.touched['location.address'] && formik.errors['location.address']}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.city"
                label="City"
                value={formik.values.location.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched['location.city'] && Boolean(formik.errors['location.city'])}
                helperText={formik.touched['location.city'] && formik.errors['location.city']}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.state"
                label="State"
                value={formik.values.location.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched['location.state'] && Boolean(formik.errors['location.state'])}
                helperText={formik.touched['location.state'] && formik.errors['location.state']}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.district"
                label="District"
                value={formik.values.location.district}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.county"
                label="County"
                value={formik.values.location.county}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.subCounty"
                label="Sub County"
                value={formik.values.location.subCounty}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.parish"
                label="Parish"
                value={formik.values.location.parish}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="location.village"
                label="Village"
                value={formik.values.location.village}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={formik.submitForm} variant="contained" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const SpacesPage = () => {
  const [spaces, setSpaces] = useState([])
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchSpaces()
    fetchOwners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, search, districtFilter, statusFilter])

  const fetchSpaces = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      })
      if (search) params.append('search', search)
      if (districtFilter) params.append('district', districtFilter)
      if (statusFilter !== '') params.append('isActive', statusFilter)

      const response = await axiosInstance.get(`/admin/spaces?${params}`)
      setSpaces(response.data.spaces)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching spaces:', error)
      showSnackbar('Error fetching spaces', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchOwners = async () => {
    try {
      const response = await axiosInstance.get('/admin/users?role=owner&limit=100')
      setOwners(response.data.users)
    } catch (error) {
      console.error('Error fetching owners:', error)
    }
  }

  const handleCreateSpace = async (spaceData) => {
    try {
      await axiosInstance.post('/admin/spaces', spaceData)
      setFormOpen(false)
      showSnackbar('Space created successfully', 'success')
      fetchSpaces()
    } catch (error) {
      console.error('Error creating space:', error)
      showSnackbar(error.response?.data?.message || 'Error creating space', 'error')
    }
  }

  const handleUpdateSpace = async (spaceData) => {
    try {
      await axiosInstance.patch(`/admin/spaces/${editingSpace.id}`, spaceData)
      setFormOpen(false)
      setEditingSpace(null)
      showSnackbar('Space updated successfully', 'success')
      fetchSpaces()
    } catch (error) {
      console.error('Error updating space:', error)
      showSnackbar(error.response?.data?.message || 'Error updating space', 'error')
    }
  }

  const handleDeleteSpace = async (spaceId) => {
    if (
      !window.confirm('Are you sure you want to delete this space? This action cannot be undone.')
    ) {
      return
    }

    try {
      await axiosInstance.delete(`/admin/spaces/${spaceId}`)
      showSnackbar('Space deleted successfully', 'success')
      fetchSpaces()
    } catch (error) {
      console.error('Error deleting space:', error)
      showSnackbar(error.response?.data?.message || 'Error deleting space', 'error')
    }
  }

  const handleEditSpace = (space) => {
    setEditingSpace(space)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingSpace(null)
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

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error'
  }

  if (loading && spaces.length === 0) {
    return (
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Skeleton variant="rectangular" height={60} />
          </Grid>
          <Grid size={{ xs: 12 }}>
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
          <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">Spaces Management</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage all platform spaces and listings
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Add Space
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Spaces
              </Typography>
              <Typography variant="h4">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Spaces
              </Typography>
              <Typography variant="h4">{spaces.filter((s) => s.isActive).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inactive Spaces
              </Typography>
              <Typography variant="h4">{spaces.filter((s) => !s.isActive).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search spaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              placeholder="Filter by district..."
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Spaces Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {spaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{space.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{space.owner?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {space.owner?.email || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{space.spaceType}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {space.location?.district || 'N/A'}, {space.location?.city || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {typeof space.capacity === 'object'
                      ? `${space.capacity.amount || 'N/A'} ${space.capacity.unit || ''}`
                      : space.capacity}
                  </TableCell>
                  <TableCell>
                    {typeof space.price === 'object'
                      ? `${space.price.amount || 'N/A'} ${space.price.unit || ''}/hr`
                      : `$${space.price}/hr`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={space.isActive ? 'Active' : 'Inactive'}
                      color={getStatusColor(space.isActive)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(space.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEditSpace(space)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSpace(space.id)}
                      color="error"
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

      {/* Space Form Dialog */}
      <SpaceForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingSpace ? handleUpdateSpace : handleCreateSpace}
        initialValues={editingSpace}
        isEditing={!!editingSpace}
        owners={owners}
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

export default SpacesPage
