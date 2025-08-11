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
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { postSpace } from '../redux/slices/spaceSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

function NewSpacePage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const fileInputRef = useRef(null)
  const [swalFire, setSwalFire] = useState(false)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.spaces)

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
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
      dispatch(postSpace(values)) // formikValues includes images as File[]
    },
  })

  useEffect(() => {
    if (loading) {
      setSwalFire(true)
    }
    if (swalFire) {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Uh Oh Something is Wrong',
          html: error,
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#CE0610',
          allowOutsideClick: false,
          customClass: {
            container: 'my-swal',
          },
        }).then(() => {
          setSwalFire(false)
        })
      } else {
        navigate('/dashboard')
        setSnackbarOpen(true)
        setSwalFire(false)
      }
    }
  }, [error, loading, navigate, swalFire])

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

        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Photos
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload high-quality photos of your space (minimum 3 photos)
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={(event) => {
                  const newFiles = Array.from(event.currentTarget.files)
                  const existingFiles = formik.values.images || []

                  const uniqueFiles = [...existingFiles, ...newFiles].filter(
                    (file, index, self) =>
                      index ===
                      self.findIndex(
                        (f) => f.name === file.name && f.lastModified === file.lastModified
                      )
                  )
                  formik.setFieldValue('images', uniqueFiles)
                }}
              />

              {/* Upload Box */}
              <Box
                onClick={handleClick}
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Upload photo
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {formik.values.images &&
                formik.values.images.length > 0 &&
                formik.values.images.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 10 }}
                  />
                ))}
            </Grid>
          </Grid>
          <Typography color="error">{formik.errors.images}</Typography>
        </Paper>

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

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Minimum Booking Duration"
                type="number"
                fullWidth
                placeholder="Minimum hours/days"
                error={formik.errors.minmumBookingDuration}
                helperText={formik.errors.minmumBookingDuration}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="duration-unit-label">Unit</InputLabel>
                <Select
                  labelId="duration-unit-label"
                  id="duration-unit"
                  label="Unit"
                  defaultValue="hours"
                  error={formik.errors.minmumBookingDurationUnit}
                >
                  <MenuItem value="hours">Hours</MenuItem>
                  <MenuItem value="days">Days</MenuItem>
                </Select>
              </FormControl>
              <FormHelperText error>{formik.errors.minmumBookingDurationUnit}</FormHelperText>
            </Grid>
          </Grid>
        </Paper>

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
                        if (checked) {
                          formik.setFieldValue('amenities', [...prev, amenity])
                        } else {
                          formik.setFieldValue(
                            'amenities',
                            prev.filter((a) => a !== amenity)
                          )
                        }
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
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Button variant="outlined">Save as Draft</Button>
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
          </Box>
        </Paper>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Space created successfully! Your new space has been added to your listings.
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default NewSpacePage
