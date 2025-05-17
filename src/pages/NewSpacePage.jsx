'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Checkbox,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function NewSpacePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSnackbarOpen(true);
    }, 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

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
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Button
          component={Link}
          to="/dashboard"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
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

      <Box component="form" onSubmit={handleSubmit}>
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
                >
                  <MenuItem value="event-venue">Event Venue</MenuItem>
                  <MenuItem value="wedding-venue">Wedding Venue</MenuItem>
                  <MenuItem value="conference-room">Conference Room</MenuItem>
                  <MenuItem value="studio">Studio</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Capacity"
                type="number"
                fullWidth
                required
                placeholder="Max number of people"
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
                required
                placeholder="Street address"
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField label="City" fullWidth required />
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField label="State/Province" fullWidth required />
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField label="Zip/Postal Code" fullWidth required />
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
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Grid item key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
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
                  <CloudUploadIcon
                    sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Upload photo {index}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
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
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                placeholder="0.00"
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="price-unit-label">Per</InputLabel>
                <Select
                  labelId="price-unit-label"
                  id="price-unit"
                  label="Per"
                  defaultValue=""
                >
                  <MenuItem value="hour">Hour</MenuItem>
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Minimum Booking Duration"
                type="number"
                fullWidth
                placeholder="Minimum hours/days"
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
                >
                  <MenuItem value="hours">Hours</MenuItem>
                  <MenuItem value="days">Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Amenities
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select the amenities available at your space
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={1}>
            {amenities.map((amenity) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={amenity}>
                <FormControlLabel control={<Checkbox />} label={amenity} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel control={<Checkbox />} label="Other" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button startIcon={<AddIcon />} variant="outlined" size="small">
              Add Custom Amenity
            </Button>
          </Box>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Space created successfully! Your new space has been added to your
          listings.
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default NewSpacePage;
