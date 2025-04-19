"use client"

import { useState } from "react"
import { Box, TextField, Button, Typography, InputAdornment, Snackbar, Alert } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

function BookingForm({ spaceId, price, priceUnit }) {
  const [date, setDate] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSnackbarOpen(true)
    }, 1500)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Box sx={{ mb: 3 }}>
          <TextField label="Full Name" fullWidth margin="normal" required placeholder="Your name" />
          <TextField label="Email" type="email" fullWidth margin="normal" required placeholder="your@email.com" />
          <TextField label="Phone Number" fullWidth margin="normal" required placeholder="(123) 456-7890" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <DatePicker
            label="Event Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            disablePast
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newTime) => setStartTime(newTime)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newTime) => setEndTime(newTime)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <TextField
          label="Event Details"
          multiline
          rows={3}
          fullWidth
          margin="normal"
          placeholder="Tell us about your event (type, number of guests, special requirements, etc.)"
        />

        <Box sx={{ mt: 3, pt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Price
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              ${price}/{priceUnit}
            </Typography>
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Request to Book"}
          </Button>

          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: "block", mt: 1 }}>
            You won't be charged yet. The space owner will confirm availability.
          </Typography>
        </Box>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            Booking request submitted! The space owner will contact you shortly.
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  )
}

export default BookingForm
