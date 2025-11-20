import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ImageGallery from '../ImageGallery'
import { useSpace } from '../../api/queries/spaceQueries'
import { leadService } from '../../api/services/leadService'

const formatPrice = (price) => {
  if (!price || price.amount == null) return 'Price upon request'
  const currency = price.currency || ''
  const amount = Number(price.amount).toLocaleString()
  const unit = price.unit ? ` / ${price.unit}` : ''
  return `${currency ? `${currency} ` : ''}${amount}${unit}`
}

const SpacePreviewModal = ({ open, spaceId, initialSpace = null, onClose, onRequestSpace }) => {
  const shouldFetch = open && !!spaceId
  const { data: fetchedSpace, isLoading, isError } = useSpace(shouldFetch ? spaceId : null)

  const space = fetchedSpace || initialSpace
  const loading = isLoading && !space
  const [quickForm, setQuickForm] = useState({ name: '', email: '', phone: '' })
  const [quickErrors, setQuickErrors] = useState({})
  const [quickSubmitting, setQuickSubmitting] = useState(false)
  const [quickSuccess, setQuickSuccess] = useState(false)
  const [quickSubmitError, setQuickSubmitError] = useState('')

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  useEffect(() => {
    if (!open) {
      setQuickForm({ name: '', email: '', phone: '' })
      setQuickErrors({})
      setQuickSuccess(false)
      setQuickSubmitting(false)
      setQuickSubmitError('')
    }
  }, [open, spaceId])

  const validateQuickForm = () => {
    const errors = {}
    if (!quickForm.name.trim()) {
      errors.name = 'Full name is required'
    }
    if (!quickForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(quickForm.email.trim().toLowerCase())) {
      errors.email = 'Enter a valid email address'
    }
    if (!quickForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (quickForm.phone.trim().length < 7) {
      errors.phone = 'Enter a valid phone number'
    }
    setQuickErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleQuickInputChange = (field) => (event) => {
    setQuickForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    setQuickErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const handleQuickSubmit = async (event) => {
    event.preventDefault()
    if (!space) return
    if (!validateQuickForm()) return
    try {
      setQuickSubmitting(true)
      setQuickSubmitError('')
      await leadService.submitLead({
        name: quickForm.name.trim(),
        email: quickForm.email.trim().toLowerCase(),
        phone: quickForm.phone.trim(),
        eventType: 'Space inquiry',
        eventDate: new Date().toISOString(),
        city:
          space.location?.city ||
          space.location?.districtName ||
          space.location?.state ||
          'Not specified',
        guestCount: 1,
        budgetRange: 'Not specified',
        notes: `Landing modal inquiry for space ${space.name}`,
        spaceId: space.id,
      })
      setQuickSuccess(true)
      setQuickForm({ name: '', email: '', phone: '' })
    } catch (error) {
      console.error('Quick lead submission failed', error)
      setQuickSubmitError(
        error?.response?.data?.message || 'Failed to submit request. Please try again.'
      )
    } finally {
      setQuickSubmitting(false)
    }
  }

  const amenities = useMemo(() => {
    if (!space?.amenities || space.amenities.length === 0) return []
    return space.amenities.slice(0, 12)
  }, [space])

  const images = space?.images || []

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle sx={{ pr: 6 }}>
        {space?.name || 'Loading space'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
          aria-label="Close preview"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && isError && (
          <Alert severity="error">We couldn’t load this space. Please try again.</Alert>
        )}

        {!loading && !isError && !space && (
          <Alert severity="info">Select a space to see more details.</Alert>
        )}

        {!loading && space && (
          <Stack spacing={3}>
            <ImageGallery images={images} name={space.name} />

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon color="primary" fontSize="small" />
                <Typography>
                  {space.location?.address ||
                    space.location?.city ||
                    'Location to be shared after booking'}
                </Typography>
              </Stack>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Capacity
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PeopleIcon color="primary" fontSize="small" />
                    <Typography>
                      {space.capacity ? `${space.capacity} guests` : 'Ask about capacity'}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Price
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachMoneyIcon color="primary" fontSize="small" />
                    <Typography>{formatPrice(space.price)}</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={space.isActive ? 'Available' : 'Unavailable'}
                    color={space.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography color="text.primary">
                {space.description ||
                  'This venue offers flexible arrangements and can be tailored to your event.'}
              </Typography>
            </Stack>

            {amenities.length > 0 && (
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {amenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      icon={<CheckCircleIcon fontSize="small" />}
                      label={amenity}
                      size="small"
                      sx={{ bgcolor: 'rgba(35, 134, 54, 0.08)' }}
                    />
                  ))}
                  {space.amenities.length > amenities.length && (
                    <Chip
                      label={`+${space.amenities.length - amenities.length} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Stack>
            )}
          </Stack>
        )}

        {space && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Request this space</Typography>
                <Typography variant="body2" color="text.secondary">
                  Share your contact details and our venue expert will reach out within a day.
                </Typography>
              </Box>

              {quickSuccess ? (
                <Alert severity="success">
                  Thanks! We&apos;ve received your request and will follow up shortly.
                </Alert>
              ) : (
                <Box component="form" onSubmit={handleQuickSubmit}>
                  <Stack spacing={2}>
                    {quickSubmitError && <Alert severity="error">{quickSubmitError}</Alert>}
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Full name"
                          name="name"
                          value={quickForm.name}
                          onChange={handleQuickInputChange('name')}
                          error={Boolean(quickErrors.name)}
                          helperText={quickErrors.name}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={quickForm.email}
                          onChange={handleQuickInputChange('email')}
                          error={Boolean(quickErrors.email)}
                          helperText={quickErrors.email}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Phone number"
                          name="phone"
                          value={quickForm.phone}
                          onChange={handleQuickInputChange('phone')}
                          error={Boolean(quickErrors.phone)}
                          helperText={quickErrors.phone}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" disabled={quickSubmitting}>
                      {quickSubmitting ? 'Sending...' : 'Send request'}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="text" onClick={() => space && onRequestSpace?.(space)} disabled={!space}>
          Full request form
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SpacePreviewModal
