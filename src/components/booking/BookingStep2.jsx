import { Box, Grid, TextField, Typography, InputAdornment } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'

function BookingStep2({ formik }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact Information
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        We'll use this information to confirm your booking and send you updates.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={formik.values.clientName}
            onChange={(e) => formik.setFieldValue('clientName', e.target.value)}
            error={!!formik.errors.clientName}
            helperText={formik.errors.clientName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formik.values.clientEmail}
            onChange={(e) => formik.setFieldValue('clientEmail', e.target.value)}
            error={!!formik.errors.clientEmail}
            helperText={formik.errors.clientEmail}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formik.values.clientPhone}
            onChange={(e) => formik.setFieldValue('clientPhone', e.target.value)}
            error={!!formik.errors.clientPhone}
            helperText={formik.errors.clientPhone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default BookingStep2
