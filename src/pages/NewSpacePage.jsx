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
  StepContent,
  Chip,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useCreateSpace } from '../api/queries/spaceQueries'
import { useSpaceTypes } from '../api/queries/spaceTypeQueries'
import { useAmenities } from '../api/queries/amenityQueries'
import { DialogActions } from '@mui/material'
import axiosInstance from '../api/axiosInstance'
import PhotoWizard from '../components/PhotoWizard'

function NewSpacePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [preview, setPreview] = useState(null)
  const MAX_IMAGES = 15

  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)

  // Location hierarchy state
  const [regions, setRegions] = useState([])
  const [districts, setDistricts] = useState([])
  const [counties, setCounties] = useState([])
  const [subcounties, setSubcounties] = useState([])
  const [parishes, setParishes] = useState([])
  const [villages, setVillages] = useState([])
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [photoWizardOpen, setPhotoWizardOpen] = useState(false)
  const navigate = useNavigate()

  const { mutate: createSpace, isPending: loading, error } = useCreateSpace()
  const { data: spaceTypesData, isLoading: loadingSpaceTypes } = useSpaceTypes(true) // Get only active space types
  const { data: amenitiesData, isLoading: loadingAmenities } = useAmenities(true) // Get only active amenities
  const spaceTypes = spaceTypesData?.spaceTypes || []
  const amenities = amenitiesData?.amenities || []

  // Fetch location data
  useEffect(() => {
    fetchRegions()
  }, [])

  const fetchRegions = async () => {
    try {
      const response = await axiosInstance.get('/locations/regions')
      setRegions(response.data)
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }

  const fetchDistricts = async (regionId) => {
    try {
      const response = await axiosInstance.get(`/locations/districts?parentId=${regionId}`)
      setDistricts(response.data)
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const fetchCounties = async (districtId) => {
    try {
      const response = await axiosInstance.get(`/locations/counties?parentId=${districtId}`)
      setCounties(response.data)
    } catch (error) {
      console.error('Error fetching counties:', error)
    }
  }

  const fetchSubcounties = async (countyId) => {
    try {
      const response = await axiosInstance.get(`/locations/subcounties?parentId=${countyId}`)
      setSubcounties(response.data)
    } catch (error) {
      console.error('Error fetching subcounties:', error)
    }
  }

  const fetchParishes = async (subcountyId) => {
    try {
      const response = await axiosInstance.get(`/locations/parishes?parentId=${subcountyId}`)
      setParishes(response.data)
    } catch (error) {
      console.error('Error fetching parishes:', error)
    }
  }

  const fetchVillages = async (parishId) => {
    try {
      const response = await axiosInstance.get(`/locations/villages?parentId=${parishId}`)
      setVillages(response.data)
    } catch (error) {
      console.error('Error fetching villages:', error)
    }
  }

  const handleLocationChange = (field, value) => {
    formik.setFieldValue(`location.${field}`, value)

    // Clear dependent fields and fetch new data
    if (field === 'region') {
      formik.setFieldValue('location.district', '')
      formik.setFieldValue('location.county', '')
      formik.setFieldValue('location.subcounty', '')
      formik.setFieldValue('location.parish', '')
      formik.setFieldValue('location.village', '')
      setDistricts([])
      setCounties([])
      setSubcounties([])
      setParishes([])
      setVillages([])
      if (value) fetchDistricts(value)
    } else if (field === 'district') {
      formik.setFieldValue('location.county', '')
      formik.setFieldValue('location.subcounty', '')
      formik.setFieldValue('location.parish', '')
      formik.setFieldValue('location.village', '')
      setCounties([])
      setSubcounties([])
      setParishes([])
      setVillages([])
      if (value) fetchCounties(value)
    } else if (field === 'county') {
      formik.setFieldValue('location.subcounty', '')
      formik.setFieldValue('location.parish', '')
      formik.setFieldValue('location.village', '')
      setSubcounties([])
      setParishes([])
      setVillages([])
      if (value) fetchSubcounties(value)
    } else if (field === 'subcounty') {
      formik.setFieldValue('location.parish', '')
      formik.setFieldValue('location.village', '')
      setParishes([])
      setVillages([])
      if (value) fetchParishes(value)
    } else if (field === 'parish') {
      formik.setFieldValue('location.village', '')
      setVillages([])
      if (value) fetchVillages(value)
    }
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const validationSchema = yup.object({
    name: yup.string().required('Required').min(5, 'Atleast 5 characters'),
    spaceTypes: yup.array().min(1, 'Select at least one space type').required('Required'),
    spaceType: yup.string().notRequired(), // Keep for backward compatibility
    capacity: yup.number().required('Required'),
    description: yup.string().required(),
    location: yup.object({
      address: yup.string().required('Required'),
      region: yup.string().notRequired(),
      district: yup.string().notRequired(),
      county: yup.string().notRequired(),
      subcounty: yup.string().notRequired(),
      parish: yup.string().notRequired(),
      village: yup.string().notRequired(),
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
      spaceTypes: [], // Changed to array for multiple selection
      spaceType: '', // Keep for backward compatibility
      capacity: null,
      description: null,
      location: {
        address: '',
        region: '',
        district: '',
        county: '',
        subcounty: '',
        parish: '',
        village: '',
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
      if (!formik.isValid) {
        setToast({
          open: true,
          message: 'Please fix all form errors before submitting',
          severity: 'error',
        })
        return
      }

      setFormSubmitted(true)
      createSpace(values) // formikValues includes images as File[]
    },
  })

  const steps = ['Basic Info', 'Location', 'Photos', 'Pricing', 'Amenities', 'Review']

  const stepHasErrors = (errors) => {
    const e = errors || formik.errors
    if (activeStep === 0) return !!(e.name || e.spaceTypes || e.capacity || e.description)
    if (activeStep === 1)
      return !!(
        e.location?.address ||
        e.location?.region ||
        e.location?.district ||
        e.location?.county ||
        e.location?.subcounty ||
        e.location?.parish ||
        e.location?.village
      )
    if (activeStep === 2) return !!e.images
    if (activeStep === 3) return !!(e.price?.amount || e.price?.unit)
    if (activeStep === 4) return !!e.amenities
    return false
  }

  const isStepCompleted = (stepIndex) => {
    const values = formik.values
    switch (stepIndex) {
      case 0: // Basic Info
        return !!(
          values.name &&
          values.spaceTypes?.length > 0 &&
          values.capacity &&
          values.description
        )
      case 1: // Location
        return !!values.location?.address
      case 2: // Photos
        return !!(values.images && values.images.length >= 6)
      case 3: // Pricing
        return !!(values.price?.amount && values.price?.unit)
      case 4: // Amenities
        return !!(values.amenities && values.amenities.length >= 1)
      case 5: // Review
        return false // Review step is never "completed" until form is submitted
      default:
        return false
    }
  }

  const handleNext = async () => {
    const errs = await formik.validateForm()
    if (stepHasErrors(errs)) {
      formik.setTouched({
        name: true,
        spaceType: true,
        capacity: true,
        description: true,
        location: {
          address: true,
          region: true,
          district: true,
          county: true,
          subcounty: true,
          parish: true,
          village: true,
        },
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

  const handlePhotoWizardSave = (images) => {
    formik.setFieldValue('images', images)
    setPhotoWizardOpen(false)
  }

  const handleOpenPhotoWizard = () => {
    setPhotoWizardOpen(true)
  }

  useEffect(() => {
    if (loading) {
      setOpen(true)
      return
    }
    // request finished
    setOpen(false)
    if (error) {
      let errorMessage = 'Failed to create space'

      if (error?.response?.data?.error) {
        // Handle multer errors and other backend errors
        errorMessage = error.response.data.error
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }

      console.error('Create space error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      })

      setToast({
        open: true,
        message: errorMessage,
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

      <Box
        component="form"
        onSubmit={(e) => {
          // Prevent all form submissions - we handle it manually via button onClick
          e.preventDefault()
        }}
        onKeyDown={(e) => {
          // Prevent Enter key from submitting the form
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
      >
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, md: 3 }} sx={{ order: { xs: 2, md: 2 } }}>
            <Box sx={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
                  {steps.map((label, idx) => (
                    <Step key={label} completed={isStepCompleted(idx)}>
                      <StepButton onClick={() => setActiveStep(idx)}>
                        <StepLabel
                          StepIconComponent={({ completed, active }) => (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: completed
                                  ? 'success.main'
                                  : active
                                    ? 'primary.main'
                                    : 'grey.300',
                                color: completed || active ? 'white' : 'grey.600',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {completed ? '✓' : idx + 1}
                            </Box>
                          )}
                        >
                          {label}
                        </StepLabel>
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </Box>
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
                      <InputLabel id="space-types-label">Space Types</InputLabel>
                      <Select
                        labelId="space-types-label"
                        id="space-types"
                        label="Space Types"
                        multiple
                        value={formik.values.spaceTypes}
                        onChange={(e) => {
                          const selectedTypes = e.target.value
                          formik.setFieldValue('spaceTypes', selectedTypes)
                          // Set first selected as primary for backward compatibility
                          if (selectedTypes.length > 0) {
                            formik.setFieldValue('spaceType', selectedTypes[0])
                          }
                        }}
                        error={!!formik.errors.spaceTypes}
                        disabled={loadingSpaceTypes || loadingAmenities}
                        renderValue={(selected) => {
                          if (selected.length === 0) return ''
                          const selectedNames = selected
                            .map((id) => spaceTypes.find((st) => st.id === id)?.name)
                            .filter(Boolean)
                          return selectedNames.join(', ')
                        }}
                      >
                        {spaceTypes.map((spaceType) => (
                          <MenuItem key={spaceType.id} value={spaceType.id}>
                            {spaceType.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error>{formik.errors.spaceTypes}</FormHelperText>
                      {(loadingSpaceTypes || loadingAmenities) && (
                        <FormHelperText>Loading space types and amenities...</FormHelperText>
                      )}
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
                      sx={{
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              size="small"
                              onClick={() => {
                                const currentValue = formik.values.capacity || 0
                                if (currentValue > 0) {
                                  formik.setFieldValue('capacity', currentValue - 1)
                                }
                              }}
                              disabled={!formik.values.capacity || formik.values.capacity <= 0}
                              sx={{
                                bgcolor: 'action.hover',
                                '&:hover': { bgcolor: 'action.selected' },
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => {
                                const currentValue = formik.values.capacity || 0
                                formik.setFieldValue('capacity', currentValue + 1)
                              }}
                              sx={{
                                bgcolor: 'action.hover',
                                '&:hover': { bgcolor: 'action.selected' },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: 0,
                      }}
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
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={formik.errors.location?.region}>
                      <InputLabel>Region</InputLabel>
                      <Select
                        value={formik.values.location.region}
                        onChange={(e) => handleLocationChange('region', e.target.value)}
                        label="Region"
                      >
                        {regions.map((region) => (
                          <MenuItem key={region.id} value={region.id}>
                            {region.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.location?.region && (
                        <FormHelperText>{formik.errors.location.region}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={formik.errors.location?.district}>
                      <InputLabel>District</InputLabel>
                      <Select
                        value={formik.values.location.district}
                        onChange={(e) => handleLocationChange('district', e.target.value)}
                        label="District"
                        disabled={!formik.values.location.region}
                      >
                        {districts.map((district) => (
                          <MenuItem key={district.id} value={district.id}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.location?.district && (
                        <FormHelperText>{formik.errors.location.district}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={formik.errors.location?.county}>
                      <InputLabel>County</InputLabel>
                      <Select
                        value={formik.values.location.county}
                        onChange={(e) => handleLocationChange('county', e.target.value)}
                        label="County"
                        disabled={!formik.values.location.district}
                      >
                        {counties.map((county) => (
                          <MenuItem key={county.id} value={county.id}>
                            {county.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.location?.county && (
                        <FormHelperText>{formik.errors.location.county}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={formik.errors.location?.subcounty}>
                      <InputLabel>Sub County</InputLabel>
                      <Select
                        value={formik.values.location.subcounty}
                        onChange={(e) => handleLocationChange('subcounty', e.target.value)}
                        label="Sub County"
                        disabled={!formik.values.location.county}
                      >
                        {subcounties.map((subcounty) => (
                          <MenuItem key={subcounty.id} value={subcounty.id}>
                            {subcounty.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.location?.subcounty && (
                        <FormHelperText>{formik.errors.location.subcounty}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={formik.errors.location?.parish}>
                      <InputLabel>Parish</InputLabel>
                      <Select
                        value={formik.values.location.parish}
                        onChange={(e) => handleLocationChange('parish', e.target.value)}
                        label="Parish"
                        disabled={!formik.values.location.subcounty}
                      >
                        {parishes.map((parish) => (
                          <MenuItem key={parish.id} value={parish.id}>
                            {parish.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.location?.parish && (
                        <FormHelperText>{formik.errors.location.parish}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={formik.errors.location?.village}>
                      <InputLabel>Village</InputLabel>
                      <Select
                        value={formik.values.location.village}
                        onChange={(e) => handleLocationChange('village', e.target.value)}
                        label="Village"
                        disabled={!formik.values.location.parish}
                      >
                        {villages.map((village) => (
                          <MenuItem key={village.id} value={village.id}>
                            {village.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.location?.village && (
                        <FormHelperText>{formik.errors.location.village}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {activeStep === 2 && (
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Photos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload high-quality photos of your space (minimum 6 photos)
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Supported formats: JPG, PNG, WebP, AVIF, GIF, BMP, TIFF
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleOpenPhotoWizard}
                    sx={{ minWidth: 200 }}
                  >
                    Open Photo Wizard
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Wizard Info */}
                <Box
                  sx={{
                    bgcolor: 'primary.50',
                    border: 1,
                    borderColor: 'primary.200',
                    borderRadius: 1,
                    p: 2,
                    mb: 3,
                  }}
                >
                  <Typography variant="body2" color="primary.dark">
                    💡 <strong>Tip:</strong> Use the Photo Wizard above to organize your photos by
                    category (Space Overview, Amenities, Facilities, etc.) for better presentation
                    to potential renters.
                  </Typography>
                </Box>

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
                      placeholder="0.00"
                      error={formik.errors.price?.amount}
                      helperText={formik.errors.price?.amount}
                      {...formik.getFieldProps('price.amount')}
                      sx={{
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="body2" sx={{ mr: 0.5 }}>
                                UGX
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const currentValue = parseFloat(formik.values.price.amount) || 0
                                  if (currentValue > 0) {
                                    formik.setFieldValue(
                                      'price.amount',
                                      Math.max(0, currentValue - 1000)
                                    )
                                  }
                                }}
                                disabled={
                                  !formik.values.price.amount || formik.values.price.amount <= 0
                                }
                                sx={{
                                  bgcolor: 'action.hover',
                                  '&:hover': { bgcolor: 'action.selected' },
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => {
                                const currentValue = parseFloat(formik.values.price.amount) || 0
                                formik.setFieldValue('price.amount', currentValue + 1000)
                              }}
                              sx={{
                                bgcolor: 'action.hover',
                                '&:hover': { bgcolor: 'action.selected' },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: 0,
                      }}
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
                    <Grid item xs={6} sm={4} key={amenity.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.amenities.includes(amenity.name)}
                            onChange={(e) => {
                              const { checked } = e.target
                              const prev = formik.values.amenities
                              if (checked)
                                formik.setFieldValue('amenities', [...prev, amenity.name])
                              else
                                formik.setFieldValue(
                                  'amenities',
                                  prev.filter((a) => a !== amenity.name)
                                )
                            }}
                            name="amenities"
                          />
                        }
                        label={amenity.name}
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
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 1 }}>
                  Review & Submit
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  Please review your information before submitting.
                </Typography>

                <Grid container spacing={3}>
                  {/* Basic Information Card */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                      <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                        📋 Basic Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item size={{ xs: 12 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            Space Name
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {formik.values.name || '-'}
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            Space Types
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {formik.values.spaceTypes?.length > 0
                              ? formik.values.spaceTypes
                                  .map((id) => spaceTypes.find((st) => st.id === id)?.name)
                                  .filter(Boolean)
                                  .join(', ')
                              : '-'}
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            Capacity
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {formik.values.capacity || '-'} people
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 12 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            Description
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ whiteSpace: 'pre-wrap' }}
                          >
                            {formik.values.description || '-'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Location Card */}
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                      <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                        📍 Location
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item size={{ xs: 12 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            Address
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {formik.values.location?.address || '-'}
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            Region
                          </Typography>
                          <Typography variant="body2">
                            {regions.find((r) => r.id === formik.values.location?.region)?.name ||
                              '-'}
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            District
                          </Typography>
                          <Typography variant="body2">
                            {districts.find((d) => d.id === formik.values.location?.district)
                              ?.name || '-'}
                          </Typography>
                        </Grid>
                        <Grid item size={{ xs: 12 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                          >
                            Full Location
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {[
                              counties.find((c) => c.id === formik.values.location?.county)?.name,
                              subcounties.find((s) => s.id === formik.values.location?.subcounty)
                                ?.name,
                              parishes.find((p) => p.id === formik.values.location?.parish)?.name,
                              villages.find((v) => v.id === formik.values.location?.village)?.name,
                            ]
                              .filter(Boolean)
                              .join(', ') || '-'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Amenities Card */}
                  <Grid item size={{ xs: 12 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                        ✨ Amenities ({formik.values.amenities?.length || 0})
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {formik.values.amenities?.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {formik.values.amenities.map((amenityId, idx) => (
                            <Chip
                              key={idx}
                              label={amenities.find((a) => a.id === amenityId)?.name || amenityId}
                              color="secondary"
                              size="medium"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No amenities selected
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  {/* Photos Card - Full Width Row */}
                  <Grid item size={{ xs: 12 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                        📸 Photos ({formik.values.images?.length || 0} / {MAX_IMAGES})
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {formik.values.images?.length > 0 ? (
                        <Grid container spacing={2}>
                          {formik.values.images.map((img, idx) => (
                            <Grid item size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={idx}>
                              <Box
                                sx={{
                                  position: 'relative',
                                  paddingTop: '100%',
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  border: 2,
                                  borderColor: idx === 0 ? 'primary.main' : 'divider',
                                  boxShadow: idx === 0 ? 3 : 1,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: 4,
                                    borderColor: 'primary.main',
                                  },
                                }}
                                onClick={() => setPreview(URL.createObjectURL(img))}
                              >
                                <Box
                                  component="img"
                                  src={URL.createObjectURL(img)}
                                  alt={`Space photo ${idx + 1}`}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                                {idx === 0 && (
                                  <Chip
                                    label="Cover"
                                    color="primary"
                                    size="small"
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      left: 8,
                                      fontWeight: 700,
                                      fontSize: '0.7rem',
                                    }}
                                  />
                                )}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    py: 0.5,
                                    px: 1,
                                    textAlign: 'center',
                                  }}
                                >
                                  <Typography variant="caption" fontWeight="600">
                                    {idx + 1} / {formik.values.images.length}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Box
                          sx={{
                            textAlign: 'center',
                            py: 4,
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No photos added yet
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  {/* Pricing Card */}
                  <Grid item size={{ xs: 12 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                      <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                        💰 Pricing
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            display: 'block',
                            mb: 1,
                          }}
                        >
                          Price
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight="700"
                          color="success.main"
                          sx={{ mb: 1 }}
                        >
                          UGX {Number(formik.values.price?.amount || 0).toLocaleString()}
                        </Typography>
                        <Chip
                          label={`per ${formik.values.price?.unit || '-'}`}
                          color="primary"
                          size="medium"
                          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
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
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                {activeStep < 5 ? (
                  <Button type="button" variant="contained" color="primary" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    color="success"
                    size="large"
                    disabled={!formik.isValid || loading}
                    onClick={() => formik.handleSubmit()}
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

      {/* Photo Wizard */}
      <PhotoWizard
        open={photoWizardOpen}
        onClose={() => setPhotoWizardOpen(false)}
        onSave={handlePhotoWizardSave}
        initialImages={formik.values.images || []}
      />
    </Container>
  )
}

export default NewSpacePage
