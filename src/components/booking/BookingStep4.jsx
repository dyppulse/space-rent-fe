// Payment Step Component - Currently hidden in MVP
// This component will be enabled when payment feature is ready for production
import {
  Box,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
  TextField,
  Grid,
  InputAdornment,
} from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../api/axiosInstance'

function BookingStep4({ formik, space, totalPrice }) {
  // Fetch available payment methods from backend
  const { data: availablePaymentMethods } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const response = await axiosInstance.get('/payments/methods')
      return response.data.data
    },
  })

  const paymentMethods = [
    {
      id: 'cash',
      label: 'Pay on Arrival',
      description: 'Pay in cash when you arrive at the venue',
      icon: <AttachMoneyIcon />,
      available: true,
    },
    {
      id: 'mobile_money_mtn',
      label: 'MTN Mobile Money',
      description: 'Pay with MTN Mobile Money',
      icon: <PhoneAndroidIcon />,
      available:
        availablePaymentMethods?.some((method) => method.id === 'mobile_money_mtn') || false,
    },
    {
      id: 'mobile_money_airtel',
      label: 'Airtel Money',
      description: 'Pay with Airtel Money',
      icon: <PhoneAndroidIcon />,
      available:
        availablePaymentMethods?.some((method) => method.id === 'mobile_money_airtel') || false,
    },
    {
      id: 'card',
      label: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: <CreditCardIcon />,
      available: false, // Will be implemented in future phases
    },
  ]

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose how you'd like to pay for your booking.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Total Amount</Typography>
          <Chip
            label={`$${totalPrice.toFixed(2)}`}
            color="primary"
            size="large"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {space?.name} •{' '}
          {formik.values.eventDate
            ? new Date(formik.values.eventDate).toLocaleDateString()
            : 'Selected date'}
        </Typography>
      </Paper>

      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">
          <Typography variant="subtitle1" gutterBottom>
            Select Payment Method
          </Typography>
        </FormLabel>
        <RadioGroup
          value={formik.values.paymentMethod}
          onChange={(e) => formik.setFieldValue('paymentMethod', e.target.value)}
        >
          {paymentMethods.map((method) => (
            <Paper
              key={method.id}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                border: formik.values.paymentMethod === method.id ? 2 : 1,
                borderColor: formik.values.paymentMethod === method.id ? 'primary.main' : 'divider',
                opacity: method.available ? 1 : 0.5,
              }}
            >
              <FormControlLabel
                value={method.id}
                control={<Radio />}
                label={
                  <Box sx={{ ml: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      {method.icon}
                      <Typography variant="subtitle1">{method.label}</Typography>
                      {!method.available && (
                        <Chip label="Coming Soon" size="small" color="default" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {method.description}
                    </Typography>
                  </Box>
                }
                disabled={!method.available}
              />
            </Paper>
          ))}
        </RadioGroup>
      </FormControl>

      {(formik.values.paymentMethod === 'mobile_money_mtn' ||
        formik.values.paymentMethod === 'mobile_money_airtel') && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mobile Money Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                placeholder="256XXXXXXXXX or 0XXXXXXXXX"
                value={formik.values.mobileMoneyPhone || ''}
                onChange={(e) => formik.setFieldValue('mobileMoneyPhone', e.target.value)}
                helperText="Enter your mobile money registered phone number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Mobile Money Payment:</strong> You'll receive payment instructions via SMS
              after booking confirmation. Please ensure your phone number is correct and you have
              sufficient balance.
            </Typography>
          </Alert>
        </Box>
      )}

      {formik.values.paymentMethod === 'cash' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Pay on Arrival:</strong> You can pay in cash when you arrive at the venue.
            Please bring the exact amount or be prepared to receive change.
          </Typography>
        </Alert>
      )}
    </Box>
  )
}

export default BookingStep4
