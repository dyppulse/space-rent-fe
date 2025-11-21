import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  Email as EmailIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  OpenInNew as OpenInNewIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { leadService } from '../../api/services/leadService'

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed']

const formatDate = (value) => {
  if (!value) return '—'
  try {
    return format(new Date(value), 'PPP')
  } catch (error) {
    console.error('Error formatting date', error)
    return '—'
  }
}

const formatCapacity = (capacity) => {
  if (!capacity) return '—'
  if (typeof capacity === 'number') {
    return `${capacity.toLocaleString()} guests`
  }

  const segments = []
  if (capacity.min) segments.push(`Min ${capacity.min}`)
  if (capacity.max) segments.push(`Max ${capacity.max}`)
  if (capacity.seated) segments.push(`Seated ${capacity.seated}`)
  if (capacity.standing) segments.push(`Standing ${capacity.standing}`)

  return segments.length > 0 ? segments.join(' • ') : '—'
}

const formatPrice = (price) => {
  if (!price || (!price.amount && price.amount !== 0)) return '—'
  const unitLabel = price.unit ? ` / ${price.unit}` : ''
  if (price.currency) {
    return `${price.currency} ${price.amount.toLocaleString()}${unitLabel}`
  }
  return `${price.amount.toLocaleString()}${unitLabel}`
}

const LeadDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true)
      const response = await leadService.getLead(id)
      setLead(response.data || null)
      setError(null)
    } catch (err) {
      console.error('Error loading lead', err)
      setError('Unable to load property request. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  const leadStatus = lead?.status || 'new'

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value
    if (!nextStatus || nextStatus === leadStatus) return

    try {
      setStatusUpdating(true)
      const response = await leadService.updateLeadStatus(id, nextStatus)
      setLead(response.data || null)
    } catch (err) {
      console.error('Error updating lead status', err)
      setError('Failed to update status. Please try again.')
    } finally {
      setStatusUpdating(false)
    }
  }

  const selectedSpaceImages = useMemo(() => {
    if (!lead?.space?.images || lead.space.images.length === 0) return []
    return lead.space.images
      .map((image) => (typeof image === 'string' ? image : image.url || image.secure_url))
      .filter(Boolean)
  }, [lead])

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/leads')}
          sx={{ mb: 2 }}
        >
          Back to property requests
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!lead) {
    return (
      <Box p={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/leads')}
          sx={{ mb: 2 }}
        >
          Back to property requests
        </Button>
        <Alert severity="warning">We could not find this property request.</Alert>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        mb={2}
      >
        <Stack spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/leads')}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back to property requests
          </Button>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={RouterLink} underline="hover" color="inherit" to="/admin/leads">
              Property Requests
            </MuiLink>
            <Typography color="text.primary">{lead.name || 'Request'}</Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={2} alignItems="center">
            <AssignmentIcon color="primary" />
            <Box>
              <Typography variant="h4">{lead.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Request ID: {lead.id}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={leadStatus}
            onChange={handleStatusChange}
            disabled={statusUpdating}
          >
            {STATUS_OPTIONS.map((statusOption) => (
              <MenuItem key={statusOption} value={statusOption}>
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Event Type
                  </Typography>
                </Stack>
                <Typography variant="subtitle1">{lead.eventType || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Event Date
                  </Typography>
                </Stack>
                <Typography variant="subtitle1">{formatDate(lead.eventDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    City / Preferred Location
                  </Typography>
                </Stack>
                <Typography variant="subtitle1">{lead.city || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PeopleIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Guest Count
                  </Typography>
                </Stack>
                <Typography variant="subtitle1">
                  {lead.guestCount ? lead.guestCount.toLocaleString() : '—'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AttachMoneyIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Budget Range
                  </Typography>
                </Stack>
                <Typography variant="subtitle1">{lead.budgetRange || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AssignmentIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Submitted
                  </Typography>
                </Stack>
                <Typography variant="subtitle1">{formatDate(lead.createdAt)}</Typography>
              </Grid>
            </Grid>
            {lead.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Notes / Preferences
                </Typography>
                <Typography>{lead.notes}</Typography>
              </>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="subtitle1">{lead.email}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="subtitle1">{lead.phone}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Request summary
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={lead.space ? 'Space interest' : 'General request'}
                  color={lead.space ? 'secondary' : 'default'}
                  size="small"
                />
                {lead.space && (
                  <Chip
                    label={lead.space?.isActive ? 'Active space' : 'Inactive space'}
                    color={lead.space?.isActive ? 'success' : 'default'}
                    size="small"
                  />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Last updated: {formatDate(lead.updatedAt)}
              </Typography>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick actions
            </Typography>
            <Stack spacing={1}>
              <Button
                component="a"
                href={`mailto:${lead.email}`}
                startIcon={<EmailIcon />}
                variant="outlined"
                fullWidth
              >
                Email client
              </Button>
              <Button
                component="a"
                href={`tel:${lead.phone}`}
                startIcon={<PhoneIcon />}
                variant="outlined"
                fullWidth
              >
                Call client
              </Button>
              {lead.space && (
                <Button
                  variant="contained"
                  endIcon={<OpenInNewIcon />}
                  fullWidth
                  onClick={() => window.open(`/spaces/${lead.space.id}`, '_blank')}
                >
                  View public listing
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Paper sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h6">Space details</Typography>
              <Typography variant="body2" color="text.secondary">
                {lead.space
                  ? 'Client expressed interest in this space'
                  : 'This request did not reference a specific space'}
              </Typography>
            </Box>
            {lead.space && <Chip label="Space interest" color="secondary" size="small" />}
          </Stack>

          {!lead.space && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No specific space was selected for this request. Share curated recommendations
              manually.
            </Alert>
          )}

          {lead.space && (
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Space name
                  </Typography>
                  <Typography variant="h6">{lead.space.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={lead.space.isActive ? 'Active' : 'Inactive'}
                    color={lead.space.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography>
                    {lead.space.location?.address || lead.space.location?.city || '—'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Capacity
                  </Typography>
                  <Typography>{formatCapacity(lead.space.capacity)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pricing
                  </Typography>
                  <Typography>{formatPrice(lead.space.price)}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography>
                {lead.space.description || 'No description provided for this space.'}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Amenities
              </Typography>
              {lead.space.amenities && lead.space.amenities.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {lead.space.amenities.map((amenity) => (
                    <Chip key={amenity} label={amenity} variant="outlined" size="small" />
                  ))}
                </Box>
              ) : (
                <Typography>No amenities listed.</Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Photos
              </Typography>
              {selectedSpaceImages.length === 0 ? (
                <Typography>No photos available for this space.</Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
                  {selectedSpaceImages.map((imageUrl, index) => (
                    <Box
                      key={imageUrl + index}
                      component="img"
                      src={imageUrl}
                      alt={`Space ${index + 1}`}
                      sx={{
                        width: 180,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                      onError={(event) => {
                        event.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

export default LeadDetailPage
