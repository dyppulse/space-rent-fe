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
  Tabs,
  Tab,
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
  { value: 'region', label: 'Region', endpoint: 'regions' },
  { value: 'district', label: 'District', endpoint: 'districts' },
  { value: 'county', label: 'County', endpoint: 'counties' },
  { value: 'subcounty', label: 'Sub County', endpoint: 'subcounties' },
  { value: 'parish', label: 'Parish', endpoint: 'parishes' },
  { value: 'village', label: 'Village', endpoint: 'villages' },
]

const LocationForm = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEditing,
  currentLevel,
  parentOptions,
}) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      code: '',
      description: '',
      parent: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      code: Yup.string().required('Code is required'),
      description: Yup.string(),
      parent: Yup.string().when('level', {
        is: 'region',
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
  }, [open, initialValues, formik])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit' : 'Create'}{' '}
        {LOCATION_LEVELS.find((l) => l.value === currentLevel)?.label}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="code"
                label="Code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
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
            {currentLevel !== 'region' && (
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
                    {parentOptions.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name} ({location.code})
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
  const [currentLevel, setCurrentLevel] = useState('region')
  const [formOpen, setFormOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [parentOptions, setParentOptions] = useState([])

  useEffect(() => {
    fetchLocations()
    fetchParentOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, search, currentLevel])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const level = LOCATION_LEVELS.find((l) => l.value === currentLevel)
      const response = await axiosInstance.get(`/locations/${level.endpoint}`)
      setLocations(response.data)
      setTotal(response.data.length)
    } catch (error) {
      console.error('Error fetching locations:', error)
      showSnackbar('Error fetching locations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchParentOptions = async () => {
    try {
      const currentIndex = LOCATION_LEVELS.findIndex((l) => l.value === currentLevel)
      if (currentIndex > 0) {
        const parentLevel = LOCATION_LEVELS[currentIndex - 1]
        const response = await axiosInstance.get(`/locations/${parentLevel.endpoint}`)
        setParentOptions(response.data)
      } else {
        setParentOptions([])
      }
    } catch (error) {
      console.error('Error fetching parent options:', error)
    }
  }

  const handleCreateLocation = async (locationData) => {
    try {
      const level = LOCATION_LEVELS.find((l) => l.value === currentLevel)
      await axiosInstance.post(`/locations/${level.endpoint}`, locationData)
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
      const level = LOCATION_LEVELS.find((l) => l.value === currentLevel)
      await axiosInstance.put(`/locations/${level.endpoint}/${editingLocation.id}`, locationData)
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
      const level = LOCATION_LEVELS.find((l) => l.value === currentLevel)
      await axiosInstance.delete(`/locations/${level.endpoint}/${locationId}`)
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
      case 'region':
        return 'primary'
      case 'district':
        return 'secondary'
      case 'county':
        return 'success'
      case 'subcounty':
        return 'warning'
      case 'parish':
        return 'info'
      case 'village':
        return 'error'
      default:
        return 'default'
    }
  }

  // Remove the early return that causes the flash

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
          Add {LOCATION_LEVELS.find((l) => l.value === currentLevel)?.label}
        </Button>
      </Box>

      {/* Level Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentLevel}
          onChange={(e, newValue) => setCurrentLevel(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {LOCATION_LEVELS.map((level) => (
            <Tab key={level.value} label={level.label} value={level.value} />
          ))}
        </Tabs>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total {LOCATION_LEVELS.find((l) => l.value === currentLevel)?.label}s
              </Typography>
              <Typography variant="h4">{total}</Typography>
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
              placeholder={`Search ${LOCATION_LEVELS.find((l) => l.value === currentLevel)?.label.toLowerCase()}s...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Locations Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Show skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton variant="text" width="60%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="40%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="50%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="30%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                  </TableRow>
                ))
              ) : locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      No{' '}
                      {LOCATION_LEVELS.find((l) => l.value === currentLevel)?.label.toLowerCase()}s
                      found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{location.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={location.code}
                        color={getLevelColor(currentLevel)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {location.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {location.region ? (
                        <Typography variant="body2">{location.region.name}</Typography>
                      ) : location.district ? (
                        <Typography variant="body2">{location.district.name}</Typography>
                      ) : location.county ? (
                        <Typography variant="body2">{location.county.name}</Typography>
                      ) : location.subcounty ? (
                        <Typography variant="body2">{location.subcounty.name}</Typography>
                      ) : location.parish ? (
                        <Typography variant="body2">{location.parish.name}</Typography>
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
                ))
              )}
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
        currentLevel={currentLevel}
        parentOptions={parentOptions}
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
