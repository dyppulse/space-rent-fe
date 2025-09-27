import { useState, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  ImageList,
  ImageListItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Home as HomeIcon,
  Wifi as WifiIcon,
  Restaurant as RestaurantIcon,
  DirectionsCar as ParkingIcon,
  Accessible as AccessibleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

const photoCategories = [
  {
    id: 'overview',
    name: 'Space Overview',
    icon: <HomeIcon />,
    description: 'Main views and layout of your space',
    color: 'primary',
    required: true,
    minPhotos: 2,
  },
  {
    id: 'amenities',
    name: 'Amenities & Features',
    icon: <WifiIcon />,
    description: 'Showcase WiFi, sound systems, projectors, etc.',
    color: 'secondary',
    required: true,
    minPhotos: 2,
  },
  {
    id: 'facilities',
    name: 'Facilities',
    icon: <RestaurantIcon />,
    description: 'Kitchen, restrooms, parking areas',
    color: 'info',
    required: false,
    minPhotos: 1,
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    icon: <AccessibleIcon />,
    description: 'Wheelchair access, ramps, accessible features',
    color: 'success',
    required: false,
    minPhotos: 0,
  },
  {
    id: 'additional',
    name: 'Additional Photos',
    icon: <PhotoCameraIcon />,
    description: 'Any other relevant photos',
    color: 'warning',
    required: false,
    minPhotos: 0,
  },
]

function PhotoWizard({ open, onClose, onSave, initialImages = [] }) {
  const [currentCategory, setCurrentCategory] = useState('overview')
  const [images, setImages] = useState(() => {
    // Initialize with existing images grouped by category
    const grouped = {}
    photoCategories.forEach((cat) => {
      grouped[cat.id] = []
    })
    initialImages.forEach((img, index) => {
      // For now, distribute existing images across categories
      const categoryIndex = index % photoCategories.length
      grouped[photoCategories[categoryIndex].id].push(img)
    })
    return grouped
  })
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  const MAX_IMAGES_PER_CATEGORY = 5

  const currentCategoryData = photoCategories.find((cat) => cat.id === currentCategory)
  const currentImages = images[currentCategory] || []

  const handleAddImages = (event) => {
    const picked = Array.from(event.currentTarget.files || [])
    const remainingSlots = Math.max(0, MAX_IMAGES_PER_CATEGORY - currentImages.length)
    const limited = picked.slice(0, remainingSlots)

    setImages((prev) => ({
      ...prev,
      [currentCategory]: [...currentImages, ...limited],
    }))

    // Reset input
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

  const handleRemoveImage = (index) => {
    setImages((prev) => ({
      ...prev,
      [currentCategory]: currentImages.filter((_, i) => i !== index),
    }))
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getAllImages = () => {
    return Object.values(images).flat()
  }

  const getCategoryStatus = (categoryId) => {
    const categoryData = photoCategories.find((cat) => cat.id === categoryId)
    const categoryImages = images[categoryId] || []
    const isComplete = categoryImages.length >= categoryData.minPhotos

    return {
      complete: isComplete,
      count: categoryImages.length,
      required: categoryData.required,
      minPhotos: categoryData.minPhotos,
    }
  }

  const canSave = () => {
    return photoCategories.every((cat) => {
      const status = getCategoryStatus(cat.id)
      return !cat.required || status.complete
    })
  }

  const handleSave = () => {
    const allImages = getAllImages()
    if (allImages.length >= 6) {
      onSave(allImages)
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
          m: 0,
          borderRadius: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1000,
          p: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h1" gutterBottom>
                Photo Upload Wizard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add meaningful photos organized by category to showcase your space
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Supported formats: JPG, PNG, WebP, AVIF, GIF, BMP, TIFF
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Category Navigation */}
          <Grid item xs={12} md={3}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom>
                Photo Categories
              </Typography>
              {photoCategories.map((category) => {
                const status = getCategoryStatus(category.id)
                return (
                  <Card
                    key={category.id}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      border: currentCategory === category.id ? 2 : 1,
                      borderColor: currentCategory === category.id ? 'primary.main' : 'divider',
                      bgcolor: currentCategory === category.id ? 'primary.50' : 'background.paper',
                    }}
                    onClick={() => setCurrentCategory(category.id)}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            color: category.color + '.main',
                            mr: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {category.icon}
                        </Box>
                        <Typography variant="subtitle2" sx={{ flex: 1 }}>
                          {category.name}
                        </Typography>
                        {status.complete && (
                          <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1, display: 'block' }}
                      >
                        {category.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          size="small"
                          label={`${status.count}/${MAX_IMAGES_PER_CATEGORY}`}
                          color={status.count > 0 ? 'primary' : 'default'}
                          variant="outlined"
                        />
                        {category.required && (
                          <Chip
                            size="small"
                            label={`Min: ${category.minPhotos}`}
                            color={status.complete ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Paper>
          </Grid>

          {/* Photo Upload Area */}
          <Grid item xs={12} md={9}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {currentCategoryData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentCategoryData.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {currentImages.length}/{MAX_IMAGES_PER_CATEGORY} photos
                  </Typography>
                  {currentCategoryData.required && (
                    <Chip
                      size="small"
                      label={`Minimum: ${currentCategoryData.minPhotos}`}
                      color={getCategoryStatus(currentCategory).complete ? 'success' : 'warning'}
                    />
                  )}
                </Box>
              </Box>

              <input
                key={currentImages.length}
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={handleAddImages}
              />

              <Grid container spacing={2}>
                {/* Upload Button */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    onClick={handleClick}
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 3,
                      height: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor:
                        currentImages.length >= MAX_IMAGES_PER_CATEGORY ? 'not-allowed' : 'pointer',
                      pointerEvents:
                        currentImages.length >= MAX_IMAGES_PER_CATEGORY ? 'none' : 'auto',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor:
                          currentImages.length >= MAX_IMAGES_PER_CATEGORY
                            ? 'inherit'
                            : 'action.hover',
                      },
                      opacity: currentImages.length >= MAX_IMAGES_PER_CATEGORY ? 0.5 : 1,
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Click to upload photos
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentImages.length}/{MAX_IMAGES_PER_CATEGORY}
                    </Typography>
                  </Box>
                </Grid>

                {/* Image Grid */}
                {currentImages.map((file, idx) => {
                  const url = URL.createObjectURL(file)
                  return (
                    <Grid item xs={12} sm={6} md={4} key={`${file.name}-${idx}`}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={url}
                          alt={file.name}
                          loading="lazy"
                          style={{
                            height: 200,
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: 8,
                            cursor: 'pointer',
                          }}
                          onClick={() => setPreview(url)}
                        />
                        <Tooltip title="Remove">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(idx)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: '#fff',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>

              {currentImages.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary',
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" gutterBottom>
                    No photos yet
                  </Typography>
                  <Typography variant="body2">
                    Click the upload area above to add photos for this category
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer with Save Button */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total photos: {getAllImages().length}/15
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Minimum 6 photos required
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!canSave() || getAllImages().length < 6}
                startIcon={<CheckCircleIcon />}
              >
                Save Photos
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md">
        <DialogTitle>Photo Preview</DialogTitle>
        <DialogContent>
          {preview && (
            <img src={preview} alt="preview" style={{ maxWidth: '100%', height: 'auto' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default PhotoWizard
