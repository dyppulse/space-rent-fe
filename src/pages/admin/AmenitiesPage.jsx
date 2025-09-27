import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Star as StarIcon } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAmenities, useCreateAmenity, useUpdateAmenity } from '../../api/queries/amenityQueries'

const validationSchema = yup.object({
  name: yup.string().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
  description: yup.string().max(200, 'Description cannot exceed 200 characters'),
  icon: yup.string().required('Icon is required'),
})

function AmenitiesPage() {
  const [open, setOpen] = useState(false)
  const [editingAmenity, setEditingAmenity] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const { data: amenitiesData, isLoading } = useAmenities(false) // Get all, including inactive
  const { mutate: createAmenity, isPending: isCreating } = useCreateAmenity()
  const { mutate: updateAmenity, isPending: isUpdating } = useUpdateAmenity()

  const amenities = amenitiesData?.amenities || []

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      icon: 'star',
      isActive: true,
    },
    validationSchema,
    onSubmit: (values) => {
      if (editingAmenity) {
        updateAmenity(
          { id: editingAmenity.id, data: values },
          {
            onSuccess: () => {
              setSnackbar({
                open: true,
                message: 'Amenity updated successfully',
                severity: 'success',
              })
              handleClose()
            },
            onError: (error) => {
              setSnackbar({
                open: true,
                message: error.message || 'Failed to update amenity',
                severity: 'error',
              })
            },
          }
        )
      } else {
        createAmenity(values, {
          onSuccess: () => {
            setSnackbar({
              open: true,
              message: 'Amenity created successfully',
              severity: 'success',
            })
            handleClose()
          },
          onError: (error) => {
            setSnackbar({
              open: true,
              message: error.message || 'Failed to create amenity',
              severity: 'error',
            })
          },
        })
      }
    },
  })

  const handleOpen = (amenity = null) => {
    setEditingAmenity(amenity)
    if (amenity) {
      formik.setValues({
        name: amenity.name,
        description: amenity.description || '',
        icon: amenity.icon || 'star',
        isActive: amenity.isActive,
      })
    } else {
      formik.resetForm()
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingAmenity(null)
    formik.resetForm()
  }

  const handleToggleActive = (amenity) => {
    updateAmenity(
      { id: amenity.id, data: { ...amenity, isActive: !amenity.isActive } },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: `Amenity "${amenity.name}" ${amenity.isActive ? 'deactivated' : 'activated'} successfully`,
            severity: 'success',
          })
        },
        onError: (error) => {
          setSnackbar({
            open: true,
            message: error.message || 'Failed to update amenity',
            severity: 'error',
          })
        },
      }
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading amenities...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Amenities Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Amenity
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {amenities.map((amenity) => (
                  <TableRow key={amenity.id}>
                    <TableCell>
                      <StarIcon sx={{ color: 'primary.main' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {amenity.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {amenity.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={amenity.isActive ? 'Active' : 'Inactive'}
                        color={amenity.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(amenity.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(amenity)}
                          color={amenity.isActive ? 'warning' : 'success'}
                          title={amenity.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Switch checked={amenity.isActive} size="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(amenity)}
                          color="primary"
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {amenities.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <StarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No amenities found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first amenity to get started
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form>
          <DialogTitle>{editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Icon"
                  name="icon"
                  value={formik.values.icon}
                  onChange={formik.handleChange}
                  error={formik.touched.icon && Boolean(formik.errors.icon)}
                  helperText={formik.touched.icon && formik.errors.icon}
                  placeholder="e.g., star, wifi, parking"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Switch
                    checked={formik.values.isActive}
                    onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                    name="isActive"
                  />
                  <Typography>Active</Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="button"
              variant="contained"
              disabled={isCreating || isUpdating}
              onClick={() => formik.handleSubmit()}
            >
              {isCreating || isUpdating ? 'Saving...' : editingAmenity ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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

export default AmenitiesPage
