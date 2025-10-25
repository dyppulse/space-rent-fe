import { Box, Grid, TextField, Typography, InputAdornment } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneInputFormik from '../../PhoneInput'

function BookingStep2({ formik }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact Information
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        We'll use this information to confirm your booking and send you updates.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

        <Box>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Phone Number
          </Typography>
          <PhoneInputFormik formik={formik} formikValue="clientPhone" defaultCountry="UG" />
        </Box>
      </Box>
    </Box>
  )
}

export default BookingStep2
