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
import { Add as AddIcon, Edit as EditIcon, Event as EventIcon } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import {
  useSpaceTypes,
  useCreateSpaceType,
  useUpdateSpaceType,
} from '../../api/queries/spaceTypeQueries'

const validationSchema = yup.object({
  name: yup.string().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
  description: yup.string().max(200, 'Description cannot exceed 200 characters'),
  icon: yup.string().required('Icon is required'),
})

function SpaceTypesPage() {
  const [open, setOpen] = useState(false)
  const [editingSpaceType, setEditingSpaceType] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const { data: spaceTypesData, isLoading } = useSpaceTypes(false) // Get all, including inactive
  const { mutate: createSpaceType, isPending: isCreating } = useCreateSpaceType()
  const { mutate: updateSpaceType, isPending: isUpdating } = useUpdateSpaceType()

  const spaceTypes = spaceTypesData?.spaceTypes || []

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      icon: 'event',
      isActive: true,
    },
    validationSchema,
    onSubmit: (values) => {
      if (editingSpaceType) {
        updateSpaceType(
          { id: editingSpaceType.id, data: values },
          {
            onSuccess: () => {
              setSnackbar({
                open: true,
                message: 'Space type updated successfully',
                severity: 'success',
              })
              handleClose()
            },
            onError: (error) => {
              setSnackbar({
                open: true,
                message: error.message || 'Failed to update space type',
                severity: 'error',
              })
            },
          }
        )
      } else {
        createSpaceType(values, {
          onSuccess: () => {
            setSnackbar({
              open: true,
              message: 'Space type created successfully',
              severity: 'success',
            })
            handleClose()
          },
          onError: (error) => {
            setSnackbar({
              open: true,
              message: error.message || 'Failed to create space type',
              severity: 'error',
            })
          },
        })
      }
    },
  })

  const handleOpen = (spaceType = null) => {
    setEditingSpaceType(spaceType)
    if (spaceType) {
      formik.setValues({
        name: spaceType.name,
        description: spaceType.description || '',
        icon: spaceType.icon || 'event',
        isActive: spaceType.isActive,
      })
    } else {
      formik.resetForm()
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingSpaceType(null)
    formik.resetForm()
  }

  const handleToggleActive = (spaceType) => {
    updateSpaceType(
      { id: spaceType.id, data: { ...spaceType, isActive: !spaceType.isActive } },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: `Space type "${spaceType.name}" ${spaceType.isActive ? 'deactivated' : 'activated'} successfully`,
            severity: 'success',
          })
        },
        onError: (error) => {
          setSnackbar({
            open: true,
            message: error.message || 'Failed to update space type',
            severity: 'error',
          })
        },
      }
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading space types...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Space Types Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Space Type
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
                {spaceTypes.map((spaceType) => (
                  <TableRow key={spaceType.id}>
                    <TableCell>
                      <EventIcon sx={{ color: 'primary.main' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {spaceType.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {spaceType.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={spaceType.isActive ? 'Active' : 'Inactive'}
                        color={spaceType.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(spaceType.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(spaceType)}
                          color={spaceType.isActive ? 'warning' : 'success'}
                          title={spaceType.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Switch checked={spaceType.isActive} size="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(spaceType)}
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

          {spaceTypes.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No space types found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first space type to get started
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form>
          <DialogTitle>{editingSpaceType ? 'Edit Space Type' : 'Add New Space Type'}</DialogTitle>
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
                  placeholder="e.g., event, business, favorite"
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
              {isCreating || isUpdating ? 'Saving...' : editingSpaceType ? 'Update' : 'Create'}
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

export default SpaceTypesPage
