import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { queryKeys } from '../../utils/queryKeys'
import axiosInstance from '../../api/axiosInstance'

const FeatureFlagsPage = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFlag, setEditingFlag] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isEnabled: true,
    category: 'other',
    config: {},
  })

  const queryClient = useQueryClient()

  // Fetch feature flags
  const { data: featureFlags, isLoading } = useQuery({
    queryKey: queryKeys.featureFlags.all,
    queryFn: async () => {
      const response = await axiosInstance.get('/feature-flags')
      return response.data.data
    },
  })

  // Create/Update feature flag mutation
  const createUpdateMutation = useMutation({
    mutationFn: async (data) => {
      if (editingFlag) {
        const response = await axiosInstance.put(`/feature-flags/${editingFlag.id}`, data)
        return response.data
      } else {
        const response = await axiosInstance.post('/feature-flags', data)
        return response.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.featureFlags.all })
      setOpenDialog(false)
      setEditingFlag(null)
      setFormData({
        name: '',
        description: '',
        isEnabled: true,
        category: 'other',
        config: {},
      })
      toast.success(
        editingFlag ? 'Feature flag updated successfully' : 'Feature flag created successfully'
      )
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred')
    },
  })

  // Toggle feature flag mutation
  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/feature-flags/${id}/toggle`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.featureFlags.all })
      toast.success('Feature flag toggled successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred')
    },
  })

  // Delete feature flag mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/feature-flags/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.featureFlags.all })
      toast.success('Feature flag deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred')
    },
  })

  const handleOpenDialog = (flag = null) => {
    if (flag) {
      setEditingFlag(flag)
      setFormData({
        name: flag.name,
        description: flag.description,
        isEnabled: flag.isEnabled,
        category: flag.category,
        config: flag.config || {},
      })
    } else {
      setEditingFlag(null)
      setFormData({
        name: '',
        description: '',
        isEnabled: true,
        category: 'other',
        config: {},
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingFlag(null)
    setFormData({
      name: '',
      description: '',
      isEnabled: true,
      category: 'other',
      config: {},
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createUpdateMutation.mutate(formData)
  }

  const handleToggle = (id) => {
    toggleMutation.mutate(id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this feature flag?')) {
      deleteMutation.mutate(id)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      payment: 'success',
      booking: 'primary',
      ui: 'info',
      integration: 'warning',
      other: 'default',
    }
    return colors[category] || 'default'
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading feature flags...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Feature Flags
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Feature Flag
        </Button>
      </Box>

      <Grid container spacing={3}>
        {featureFlags?.map((flag) => (
          <Grid item xs={12} md={6} lg={4} key={flag.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {flag.name}
                    </Typography>
                    <Chip
                      label={flag.category}
                      color={getCategoryColor(flag.category)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggle(flag.id)}
                      disabled={toggleMutation.isPending}
                    >
                      {flag.isEnabled ? <ToggleOnIcon color="success" /> : <ToggleOffIcon />}
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDialog(flag)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(flag.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {flag.description}
                </Typography>

                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip
                    label={flag.isEnabled ? 'Enabled' : 'Disabled'}
                    color={flag.isEnabled ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                {Object.keys(flag.config || {}).length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Configuration:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {JSON.stringify(flag.config, null, 2)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingFlag ? 'Edit Feature Flag' : 'Add Feature Flag'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={editingFlag}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                  >
                    <MenuItem value="payment">Payment</MenuItem>
                    <MenuItem value="booking">Booking</MenuItem>
                    <MenuItem value="ui">UI</MenuItem>
                    <MenuItem value="integration">Integration</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isEnabled}
                      onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                    />
                  }
                  label="Enabled"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createUpdateMutation.isPending}>
              {editingFlag ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default FeatureFlagsPage
