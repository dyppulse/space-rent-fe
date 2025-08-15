import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  ImageList,
  ImageListItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { postSpace } from '../redux/slices/spaceSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { DialogActions } from '@mui/material'

function NewSpacePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [preview, setPreview] = useState(null)
  const MAX_IMAGES = 15

  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.spaces)

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const amenities = [
    'WiFi',
    'Sound System',
    'Projector',
    'Kitchen',
    'Restrooms',
    'Heating/AC',
    'Furniture',
    'Parking',
    'Wheelchair Accessible',
    'Catering',
    'Lighting Equipment',
    'Stage',
    'Tables/Chairs',
    'Dressing Room',
    'Outdoor Space',
  ]

  const validationSchema = yup.object({
    name: yup.string().required('Required').min(5, 'Atleast 5 characters'),
    spaceType: yup.string().required('Required'),
    capacity: yup.number().required('Required'),
    description: yup.string().required(),
    location: yup.object({
      address: yup.string().required('Required'),
      city: yup.string().required('Required'),
      state: yup.string().required('Required'),
      zipCode: yup.string().notRequired(),
    }),
    images: yup.array().min(6, 'Atleast 6'),
    price: yup.object({
      amount: yup.number().required('Required'),
      unit: yup.string().required('Required'),
    }),
    // minmumBookingDuration: yup.number().required("Required"),
    // minmumBookingDurationUnit: yup.string().required("Required"),
    amenities: yup.array().min(1, 'Select atleast one'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      spaceType: '',
      capacity: null,
      description: null,
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      images: [],
      price: {
        amount: '',
        unit: '',
      },
      minmumBookingDuration: null,
      minmumBookingDurationUnit: '',
      amenities: [],
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (values) => {
      setFormSubmitted(true)
      dispatch(postSpace(values)) // formikValues includes images as File[]
    },
  })

  const steps = ['Basic Info', 'Location', 'Photos', 'Pricing', 'Amenities', 'Review']

  const stepHasErrors = (errors) => {
    const e = errors || formik.errors
    if (activeStep === 0) return !!(e.name || e.spaceType || e.capacity || e.description)
    if (activeStep === 1)
      return !!(e.location?.address || e.location?.city || e.location?.state || e.location?.zipCode)
    if (activeStep === 2) return !!e.images
    if (activeStep === 3) return !!(e.price?.amount || e.price?.unit)
    if (activeStep === 4) return !!e.amenities
    return false
  }

  const handleNext = async () => {
    const errs = await formik.validateForm()
    if (stepHasErrors(errs)) {
      formik.setTouched({
        name: true,
        spaceType: true,
        capacity: true,
        description: true,
        location: { address: true, city: true, state: true, zipCode: true },
        images: true,
        price: { amount: true, unit: true },
        amenities: true,
      })
      return
    }
    setActiveStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0))

  const handleAddImages = (event) => {
    const picked = Array.from(event.currentTarget.files || [])
    const existingFiles = formik.values.images || []
    const remainingSlots = Math.max(0, MAX_IMAGES - existingFiles.length)
    const limited = picked.slice(0, remainingSlots)
    const uniqueFiles = [...existingFiles, ...limited].filter((file, index, self) => {
      return (
        index ===
        self.findIndex((f) => f.name === file.name && f.lastModified === file.lastModified)
      )
    })
    formik.setFieldValue('images', uniqueFiles)
    // Reset input so selecting the same file again still triggers onChange
    if (fileInputRef.current) {
      setTimeout(() => {
        try {
          fileInputRef.current.value = ''
        } catch {
          // Ignore error when clearing file input
        }
      }, 0)
    }
  }

  const handleRemoveImage = (idx) => {
    const next = (formik.values.images || []).filter((_, i) => i !== idx)
    formik.setFieldValue('images', next)
  }

  useEffect(() => {
    if (loading) {
      setOpen(true)
      return
    }
    // request finished
    setOpen(false)
    if (error) {
      setToast({
        open: true,
        message: String(error || 'Failed to create space'),
        severity: 'error',
      })
    } else if (!error && !loading && formSubmitted) {
      // Only redirect if form was submitted, not loading, and no error (success case)
      navigate('/dashboard')
      setToast({
        open: true,
        message: 'Space created successfully! Your new space has been added to your listings.',
        severity: 'success',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading, formSubmitted])

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Button component={Link} to="/dashboard" startIcon={<ArrowBackIcon />} sx={{ mr: 2 }}>
          Back
        </Button>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Space
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a new listing for your space
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, md: 3 }} sx={{ order: { xs: 2, md: 2 } }}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, position: 'sticky', top: 16 }}>
              <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
                {steps.map((label, idx) => (
                  <Step key={label}>
                    <StepButton onClick={() => setActiveStep(idx)}>
                      <StepLabel>{label}</StepLabel>
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, md: 9 }} sx={{ order: { xs: 1, md: 1 } }}>
            {activeStep === 0 && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Provide the essential details about your space
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12 }}>
                    <TextField
                      label="Space Name"
                      fullWidth
                      required
                      placeholder="e.g. Modern Downtown Loft"
                      error={formik.errors.name}
                      helperText={formik.errors.name}
                      {...formik.getFieldProps('name')}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel id="space-type-label">Space Type</InputLabel>
                      <Select
                        labelId="space-type-label"
                        id="space-type"
                        label="Space Type"
                        defaultValue=""
                        error={formik.errors.spaceType}
                        {...formik.getFieldProps('spaceType')}
                      >
                        <MenuItem value="event-venue">Event Venue</MenuItem>
                        <MenuItem value="wedding-venue">Wedding Venue</MenuItem>
                        <MenuItem value="conference-room">Conference Room</MenuItem>
                        <MenuItem value="studio">Studio</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                      <FormHelperText error>{formik.errors.spaceType}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Capacity"
                      type="number"
                      fullWidth
                      required
                      placeholder="Max number of people"
                      error={formik.errors.capacity}
                      helperText={formik.errors.capacity}
                      {...formik.getFieldProps('capacity')}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12 }}>
                    <TextField
                      label="Description"
                      multiline
                      rows={5}
                      fullWidth
                      required
                      placeholder="Describe your space in detail..."
                      error={formik.errors.description}
                      helperText={formik.errors.description}
                      {...formik.getFieldProps('description')}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {activeStep === 1 && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Where is your space located?
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12 }}>
                    <TextField
                      label="Address"
                      fullWidth
                      placeholder="Street address"
                      error={formik.errors.location?.address}
                      helperText={formik.errors.location?.address}
                      {...formik.getFieldProps('location.address')}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="City"
                      fullWidth
                      error={formik.errors.location?.city}
                      helperText={formik.errors.location?.city}
                      {...formik.getFieldProps('location.city')}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="state"
                      fullWidth
                      error={formik.errors.location?.state}
                      helperText={formik.errors.location?.state}
                      {...formik.getFieldProps('location.state')}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Zip/Postal Code"
                      fullWidth
                      {...formik.getFieldProps('location.zipCode')}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {activeStep === 2 && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Photos
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Upload high-quality photos of your space (minimum 3 photos)
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <input
                  key={formik.values.images?.length || 0}
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  onChange={handleAddImages}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      onClick={handleClick}
                      sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2,
                        height: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        cursor:
                          (formik.values.images?.length || 0) >= MAX_IMAGES
                            ? 'not-allowed'
                            : 'pointer',
                        pointerEvents:
                          (formik.values.images?.length || 0) >= MAX_IMAGES ? 'none' : 'auto',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload photos
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formik.values.images?.length || 0}/{MAX_IMAGES}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <ImageList cols={3} gap={8} sx={{ m: 0 }}>
                      {(formik.values.images || []).map((file, idx) => {
                        const url = URL.createObjectURL(file)
                        return (
                          <ImageListItem key={`${file.name}-${idx}`} sx={{ position: 'relative' }}>
                            <img
                              src={url}
                              alt={file.name}
                              loading="lazy"
                              style={{
                                height: 160,
                                width: '100%',
                                objectFit: 'cover',
                                borderRadius: 8,
                              }}
                              onClick={() => setPreview(url)}
                            />
                            <Tooltip title="Remove">
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(idx)}
                                sx={{
                                  position: 'absolute',
                                  top: 6,
                                  right: 6,
                                  bgcolor: 'rgba(0,0,0,0.5)',
                                  color: '#fff',
                                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </ImageListItem>
                        )
                      })}
                    </ImageList>
                  </Grid>
                </Grid>
                {formik.errors.images && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {formik.errors.images}
                  </Typography>
                )}
                <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md">
                  <DialogTitle>Preview</DialogTitle>
                  <DialogContent>
                    {preview && (
                      <img
                        src={preview}
                        alt="preview"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </Paper>
            )}

            {activeStep === 3 && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Pricing
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Set your pricing details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Shs</InputAdornment>,
                      }}
                      placeholder="0.00"
                      error={formik.errors.price?.amount}
                      helperText={formik.errors.price?.amount}
                      {...formik.getFieldProps('price.amount')}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="price-unit-label">Per</InputLabel>
                      <Select
                        labelId="price-unit-label"
                        id="price-unit"
                        label="Per"
                        defaultValue=""
                        error={formik.errors.price?.unit}
                        {...formik.getFieldProps('price.unit')}
                      >
                        <MenuItem value="hour">Hour</MenuItem>
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="event">Event</MenuItem>
                      </Select>
                      <FormHelperText error>{formik.errors.price?.unit}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {activeStep === 4 && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Amenities
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Select all amenities that your space provides
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  {amenities.map((amenity) => (
                    <Grid item xs={6} sm={4} key={amenity}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.amenities.includes(amenity)}
                            onChange={(e) => {
                              const { checked } = e.target
                              const prev = formik.values.amenities
                              if (checked) formik.setFieldValue('amenities', [...prev, amenity])
                              else
                                formik.setFieldValue(
                                  'amenities',
                                  prev.filter((a) => a !== amenity)
                                )
                            }}
                            name="amenities"
                          />
                        }
                        label={amenity}
                      />
                    </Grid>
                  ))}
                </Grid>
                {formik.errors.amenities && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {formik.errors.amenities}
                  </FormHelperText>
                )}
              </Paper>
            )}

            {activeStep === 5 && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Review & Submit
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please review your information before submitting.
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography>{formik.values.name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Type</Typography>
                    <Typography>{formik.values.spaceType || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Capacity</Typography>
                    <Typography>{formik.values.capacity || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Address</Typography>
                    <Typography>
                      {formik.values.location.address}, {formik.values.location.city},{' '}
                      {formik.values.location.state}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Price</Typography>
                    <Typography>
                      {formik.values.price.amount} / {formik.values.price.unit}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Amenities</Typography>
                    <Typography>{(formik.values.amenities || []).join(', ') || '-'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
                  Back
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button variant="contained" color="primary" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={!formik.isValid || loading}
                  >
                    {loading && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />}
                    {loading ? 'Creating...' : 'Create Listing'}
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Dialog open={open && !error} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Creating your listing…</DialogTitle>
        <DialogContent>Please wait while we save your space.</DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Container>
  )
}

export default NewSpacePage
