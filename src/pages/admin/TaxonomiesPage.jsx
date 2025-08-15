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
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../api/axiosInstance'

const TaxonomyForm = ({ open, onClose, onSubmit, initialValues, isEditing }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      type: 'spaceType',
      key: '',
      label: '',
      sortOrder: 0,
      isActive: true,
    },
    validationSchema: Yup.object({
      type: Yup.string().oneOf(['spaceType', 'amenity'], 'Invalid type'),
      key: Yup.string()
        .required('Key is required')
        .matches(/^[a-z0-9-]+$/, 'Key must be lowercase letters, numbers, and hyphens only'),
      label: Yup.string().required('Label is required'),
      sortOrder: Yup.number()
        .integer('Sort order must be an integer')
        .min(0, 'Sort order must be 0 or greater'),
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
      <DialogTitle>{isEditing ? 'Edit Taxonomy' : 'Create New Taxonomy'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Type"
                  error={formik.touched.type && Boolean(formik.errors.type)}
                >
                  <MenuItem value="spaceType">Space Type</MenuItem>
                  <MenuItem value="amenity">Amenity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="key"
                label="Key (unique identifier)"
                placeholder="e.g., wedding-venue, wifi, parking"
                value={formik.values.key}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.key && Boolean(formik.errors.key)}
                helperText={formik.touched.key && formik.errors.key}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="label"
                label="Display Label"
                placeholder="e.g., Wedding Venue, WiFi, Parking"
                value={formik.values.label}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.label && Boolean(formik.errors.label)}
                helperText={formik.touched.label && formik.errors.label}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="sortOrder"
                label="Sort Order"
                type="number"
                value={formik.values.sortOrder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sortOrder && Boolean(formik.errors.sortOrder)}
                helperText={formik.touched.sortOrder && formik.errors.sortOrder}
              />
            </Grid>
            <Grid item xs={12}>
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

const TaxonomiesPage = () => {
  const [taxonomies, setTaxonomies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTaxonomy, setEditingTaxonomy] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchTaxonomies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, search, typeFilter])

  const fetchTaxonomies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      })
      if (search) params.append('search', search)
      if (typeFilter) params.append('type', typeFilter)

      const response = await axiosInstance.get(`/admin/taxonomies?${params}`)
      setTaxonomies(response.data.taxonomies)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching taxonomies:', error)
      showSnackbar('Error fetching taxonomies', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTaxonomy = async (taxonomyData) => {
    try {
      await axiosInstance.post('/admin/taxonomies', taxonomyData)
      setFormOpen(false)
      showSnackbar('Taxonomy created successfully', 'success')
      fetchTaxonomies()
    } catch (error) {
      console.error('Error creating taxonomy:', error)
      showSnackbar(error.response?.data?.message || 'Error creating taxonomy', 'error')
    }
  }

  const handleUpdateTaxonomy = async (taxonomyData) => {
    try {
      await axiosInstance.patch(`/admin/taxonomies/${editingTaxonomy.id}`, taxonomyData)
      setFormOpen(false)
      setEditingTaxonomy(null)
      showSnackbar('Taxonomy updated successfully', 'success')
      fetchTaxonomies()
    } catch (error) {
      console.error('Error updating taxonomy:', error)
      showSnackbar(error.response?.data?.message || 'Error updating taxonomy', 'error')
    }
  }

  const handleDeleteTaxonomy = async (taxonomyId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this taxonomy? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      await axiosInstance.delete(`/admin/taxonomies/${taxonomyId}`)
      showSnackbar('Taxonomy deleted successfully', 'success')
      fetchTaxonomies()
    } catch (error) {
      console.error('Error deleting taxonomy:', error)
      showSnackbar(error.response?.data?.message || 'Error deleting taxonomy', 'error')
    }
  }

  const handleEditTaxonomy = (taxonomy) => {
    setEditingTaxonomy(taxonomy)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingTaxonomy(null)
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'spaceType':
        return 'primary'
      case 'amenity':
        return 'secondary'
      default:
        return 'default'
    }
  }

  if (loading && taxonomies.length === 0) {
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
          <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">Taxonomies Management</Typography>
            <Typography variant="body1" color="textSecondary">
              Manage space types and amenities for the platform
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Add Taxonomy
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Taxonomies
              </Typography>
              <Typography variant="h4">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Space Types
              </Typography>
              <Typography variant="h4">
                {taxonomies.filter((t) => t.type === 'spaceType').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Amenities
              </Typography>
              <Typography variant="h4">
                {taxonomies.filter((t) => t.type === 'amenity').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active
              </Typography>
              <Typography variant="h4">{taxonomies.filter((t) => t.isActive).length}</Typography>
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
              placeholder="Search taxonomies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="spaceType">Space Types</MenuItem>
                <MenuItem value="amenity">Amenities</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Taxonomies Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Key</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Sort Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxonomies.map((taxonomy) => (
                <TableRow key={taxonomy.id}>
                  <TableCell>
                    <Chip
                      label={taxonomy.type === 'spaceType' ? 'Space Type' : 'Amenity'}
                      color={getTypeColor(taxonomy.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {taxonomy.key}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{taxonomy.label}</Typography>
                  </TableCell>
                  <TableCell>{taxonomy.sortOrder}</TableCell>
                  <TableCell>
                    <Chip
                      label={taxonomy.isActive ? 'Active' : 'Inactive'}
                      color={taxonomy.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(taxonomy.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditTaxonomy(taxonomy)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTaxonomy(taxonomy.id)}
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

      {/* Taxonomy Form Dialog */}
      <TaxonomyForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingTaxonomy ? handleUpdateTaxonomy : handleCreateTaxonomy}
        initialValues={editingTaxonomy}
        isEditing={!!editingTaxonomy}
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

export default TaxonomiesPage
