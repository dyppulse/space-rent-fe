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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../api/axiosInstance'

const LOCATION_LEVELS = [
  { value: 'district', label: 'District' },
  { value: 'county', label: 'County' },
  { value: 'subCounty', label: 'Sub County' },
  { value: 'parish', label: 'Parish' },
  { value: 'village', label: 'Village' },
]

const LocationForm = ({ open, onClose, onSubmit, initialValues, isEditing, locations }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      level: 'district',
      name: '',
      parent: '',
    },
    validationSchema: Yup.object({
      level: Yup.string().oneOf(
        LOCATION_LEVELS.map((l) => l.value),
        'Invalid level'
      ),
      name: Yup.string().required('Name is required'),
      parent: Yup.string().when('level', {
        is: 'district',
        then: () => Yup.string().nullable(),
        otherwise: () => Yup.string().required('Parent location is required'),
      }),
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

  const getParentOptions = () => {
    if (formik.values.level === 'district') return []

    const parentLevel = LOCATION_LEVELS.findIndex((l) => l.value === formik.values.level) - 1
    if (parentLevel < 0) return []

    const parentLevelValue = LOCATION_LEVELS[parentLevel]?.value
    return locations.filter((l) => l.level === parentLevelValue)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Location' : 'Create New Location'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={formik.values.level}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Level"
                  error={formik.touched.level && Boolean(formik.errors.level)}
                >
                  {LOCATION_LEVELS.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="name"
                label="Location Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            {formik.values.level !== 'district' && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Parent Location</InputLabel>
                  <Select
                    name="parent"
                    value={formik.values.parent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Parent Location"
                    error={formik.touched.parent && Boolean(formik.errors.parent)}
                  >
                    {getParentOptions().map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name} ({location.level})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
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

const LocationsPage = () => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchLocations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, search, levelFilter])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      })
      if (search) params.append('search', search)
      if (levelFilter) params.append('level', levelFilter)

      const response = await axiosInstance.get(`/admin/locations?${params}`)
      setLocations(response.data.locations)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching locations:', error)
      showSnackbar('Error fetching locations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLocation = async (locationData) => {
    try {
      await axiosInstance.post('/admin/locations', locationData)
      setFormOpen(false)
      showSnackbar('Location created successfully', 'success')
      fetchLocations()
    } catch (error) {
      console.error('Error creating location:', error)
      showSnackbar(error.response?.data?.message || 'Error creating location', 'error')
    }
  }

  const handleUpdateLocation = async (locationData) => {
    try {
      await axiosInstance.patch(`/admin/locations/${editingLocation.id}`, locationData)
      setFormOpen(false)
      setEditingLocation(null)
      showSnackbar('Location updated successfully', 'success')
      fetchLocations()
    } catch (error) {
      console.error('Error updating location:', error)
      showSnackbar(error.response?.data?.message || 'Error updating location', 'error')
    }
  }

  const handleDeleteLocation = async (locationId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this location? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      await axiosInstance.delete(`/admin/locations/${locationId}`)
      showSnackbar('Location deleted successfully', 'success')
      fetchLocations()
    } catch (error) {
      console.error('Error deleting location:', error)
      showSnackbar(error.response?.data?.message || 'Error deleting location', 'error')
    }
  }

  const handleEditLocation = (location) => {
    setEditingLocation(location)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingLocation(null)
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

  const getLevelColor = (level) => {
    switch (level) {
      case 'district':
        return 'primary'
      case 'county':
        return 'secondary'
      case 'subCounty':
        return 'success'
      case 'parish':
        return 'warning'
      case 'village':
        return 'info'
      default:
        return 'default'
    }
  }

  if (loading && locations.length === 0) {
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
          <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">Locations Management</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage Uganda administrative divisions and locations
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Add Location
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Locations
              </Typography>
              <Typography variant="h4">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Districts
              </Typography>
              <Typography variant="h4">
                {locations.filter((l) => l.level === 'district').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Counties
              </Typography>
              <Typography variant="h4">
                {locations.filter((l) => l.level === 'county').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sub Counties
              </Typography>
              <Typography variant="h4">
                {locations.filter((l) => l.level === 'subCounty').length}
              </Typography>
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
              placeholder="Search locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                label="Level"
              >
                <MenuItem value="">All Levels</MenuItem>
                {LOCATION_LEVELS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Locations Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <Chip
                      label={
                        LOCATION_LEVELS.find((l) => l.value === location.level)?.label ||
                        location.level
                      }
                      color={getLevelColor(location.level)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{location.name}</Typography>
                  </TableCell>
                  <TableCell>
                    {location.parent ? (
                      <Typography variant="body2">
                        {location.parent.name} ({location.parent.level})
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Root Level
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{new Date(location.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditLocation(location)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteLocation(location.id)}
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
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Location Form Dialog */}
      <LocationForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingLocation ? handleUpdateLocation : handleCreateLocation}
        initialValues={editingLocation}
        isEditing={!!editingLocation}
        locations={locations}
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

export default LocationsPage
