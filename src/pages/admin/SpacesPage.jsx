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
  // TextareaAutosize,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Visibility as ViewIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../api/axiosInstance'

// eslint-disable-next-line no-unused-vars
const SpaceForm = ({ open, onClose, onSubmit, initialValues, isEditing, owners }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [imagesToRemove, setImagesToRemove] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])

  const formik = useFormik({
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    enableReinitialize: false,
    initialValues: initialValues || {
      name: '',
      description: '',
      spaceType: '',
      capacity: '',
      price: '',
      isActive: true,
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
      // owner: Yup.string().required('Owner is required'),
      'location.address': Yup.string().required('Address is required'),
      'location.city': Yup.string().required('City is required'),
      'location.state': Yup.string().required('State is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('SpaceForm onSubmit called with values:', values)
      console.log('Form validation errors:', formik.errors)

      try {
        // Create FormData for file upload
        const formData = new FormData()

        // Add all form fields
        Object.keys(values).forEach((key) => {
          if (key === 'images') return // Skip images, handled separately
          if (key === 'owner') return // Skip owner field (commented out)
          if (key === 'location') {
            formData.append('location', JSON.stringify(values.location))
          } else if (key === 'amenities') {
            formData.append('amenities', JSON.stringify(values.amenities))
          } else if (key === 'capacity') {
            formData.append('capacity', JSON.stringify(values.capacity))
          } else if (key === 'price') {
            formData.append('price', JSON.stringify(values.price))
          } else {
            formData.append(key, values[key])
          }
        })

        // Add new image files
        selectedImages.forEach((file) => {
          formData.append('images', file)
        })

        // Add images to remove (for editing)
        if (isEditing && imagesToRemove.length > 0) {
          formData.append('imagesToRemove', JSON.stringify(imagesToRemove))
        }

        console.log('Calling onSubmit with formData')
        await onSubmit(formData)
        setSubmitting(false)
      } catch (error) {
        console.error('Error in form submission:', error)
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (open && initialValues) {
      // Remove owner field if present
      // eslint-disable-next-line no-unused-vars
      const { owner, ...valuesWithoutOwner } = initialValues
      // Ensure location object exists
      if (!valuesWithoutOwner.location) {
        valuesWithoutOwner.location = {
          address: '',
          city: '',
          state: '',
          district: '',
          county: '',
          subCounty: '',
          parish: '',
          village: '',
          coordinates: { lat: '', lng: '' },
        }
      }
      formik.setValues(valuesWithoutOwner)
      // Set existing images
      const existing = initialValues.images || []
      setExistingImages(existing)
      setImagesToRemove([])
      setSelectedImages([])
      setImagePreviewUrls([])
    } else if (open && !initialValues) {
      // Reset for new space - ensure location is properly initialized
      formik.resetForm({
        values: {
          name: '',
          description: '',
          spaceType: '',
          capacity: '',
          price: '',
          isActive: true,
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
      })
      setExistingImages([])
      setImagesToRemove([])
      setSelectedImages([])
      setImagePreviewUrls([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues])

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files)
    if (files.length + selectedImages.length + existingImages.length - imagesToRemove.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }

    setSelectedImages((prev) => [...prev, ...files])

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls((prev) => [...prev, ...newPreviews])
  }

  const handleRemoveNewImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    // Revoke preview URL
    URL.revokeObjectURL(imagePreviewUrls[index])
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (imageUrl) => {
    setImagesToRemove((prev) => [...prev, imageUrl])
    setExistingImages((prev) => prev.filter((img) => img.url !== imageUrl))
  }

  // eslint-disable-next-line no-unused-vars
  const handleRestoreImage = (imageUrl) => {
    setImagesToRemove((prev) => prev.filter((url) => url !== imageUrl))
    // Find the original image from initialValues
    const originalImage = initialValues?.images?.find((img) => img.url === imageUrl)
    if (originalImage) {
      setExistingImages((prev) => [...prev, originalImage])
    }
  }

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviewUrls])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Space' : 'Create New Space'}</DialogTitle>
      <DialogContent>
        {/* Display validation errors */}
        {Object.keys(formik.errors).length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#fee', borderRadius: 1 }}>
            <Typography variant="body2" color="error">
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {Object.entries(formik.errors).map(([key, error]) => (
                <li key={key} style={{ fontSize: '0.875rem', color: '#d32f2f' }}>
                  {key}: {error}
                </li>
              ))}
            </ul>
          </Box>
        )}
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
            {/* Owner field commented out for now */}
            {/* <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid> */}
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
                value={formik.values.location?.address || ''}
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
                value={formik.values.location?.city || ''}
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
                value={formik.values.location?.state || ''}
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

            {/* Image Upload Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Images
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Upload up to 10 images. Maximum file size: 5MB per image.
              </Typography>

              {/* Image Upload Button */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageSelect}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Images
                  </Button>
                </label>
              </Box>

              {/* Image Preview Gallery */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {/* Existing Images */}
                {existingImages.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={image.url || image}
                      alt={`Space ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveExistingImage(image.url || image)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {/* New Selected Images */}
                {imagePreviewUrls.map((previewUrl, index) => (
                  <Box
                    key={`new-${index}`}
                    sx={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt={`New ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNewImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {/* Placeholder for empty state */}
                {existingImages.length === 0 && imagePreviewUrls.length === 0 && (
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      border: '2px dashed #ddd',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: 'text.secondary',
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="caption">No images</Typography>
                  </Box>
                )}
              </Box>

              {/* Show removed images count */}
              {imagesToRemove.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {imagesToRemove.length} image(s) will be removed. Click on removed images to
                  restore them.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            console.log('Submit button clicked')
            console.log('Form values:', formik.values)
            console.log('Form errors:', formik.errors)
            console.log('Form touched:', formik.touched)
            console.log('Form isValid:', formik.isValid)
            // Manually trigger validation and submission
            formik.validateForm().then((errors) => {
              if (Object.keys(errors).length === 0) {
                console.log('No validation errors, submitting form')
                formik.submitForm()
              } else {
                console.error('Validation errors:', errors)
                // Mark all error fields as touched to show errors
                const touched = {}
                Object.keys(errors).forEach((key) => {
                  touched[key] = true
                })
                formik.setTouched(touched)
              }
            })
          }}
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const SpacesPage = () => {
  const [spaces, setSpaces] = useState([])
  // const [owners, setOwners] = useState([]) // Commented out - owner field removed for now
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
    // fetchOwners() // Commented out - owner field removed for now
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

  // fetchOwners commented out - owner field removed for now
  // const fetchOwners = async () => {
  //   try {
  //     const response = await axiosInstance.get('/admin/users?role=owner&limit=100')
  //     setOwners(response.data.users)
  //   } catch (error) {
  //     console.error('Error fetching owners:', error)
  //   }
  // }

  const handleCreateSpace = async (formData) => {
    console.log('handleCreateSpace called with formData')
    try {
      console.log('Making POST request to /admin/spaces')
      const response = await axiosInstance.post('/admin/spaces', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Space created successfully:', response.data)
      setFormOpen(false)
      showSnackbar('Space created successfully', 'success')
      fetchSpaces()
    } catch (error) {
      console.error('Error creating space:', error)
      console.error('Error response:', error.response)
      showSnackbar(error.response?.data?.message || 'Error creating space', 'error')
    }
  }

  const handleUpdateSpace = async (formData) => {
    try {
      await axiosInstance.patch(`/admin/spaces/${editingSpace.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
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
                  <TableCell>
                    {space.spaceTypes?.length > 0
                      ? space.spaceTypes.map((st) => st.name).join(', ')
                      : space.spaceType?.name || space.spaceTypeName}
                  </TableCell>
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
                      ? `UGX ${space.price.amount?.toLocaleString() || 'N/A'}/${space.price.unit || 'hr'}`
                      : `UGX ${space.price?.toLocaleString() || 'N/A'}/hr`}
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
        owners={[]} // owners={owners} - commented out since owner field is removed
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
