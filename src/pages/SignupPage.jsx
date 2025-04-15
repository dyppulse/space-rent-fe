"use client"
import { Link } from "react-router-dom"
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import FacebookIcon from "@mui/icons-material/Facebook"

function SignupPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle signup logic here
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create an account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up as a space owner to list your venue on our platform
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
          />

          <FormControlLabel
            control={<Checkbox value="terms" color="primary" />}
            label={
              <Typography variant="body2">
                I agree to the{" "}
                <Link to="/terms">
                  <Typography component="span" variant="body2" color="primary">
                    terms of service
                  </Typography>
                </Link>{" "}
                and{" "}
                <Link to="/privacy">
                  <Typography component="span" variant="body2" color="primary">
                    privacy policy
                  </Typography>
                </Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />

          <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3, mb: 2 }}>
            Create account
          </Button>

          <Box sx={{ position: "relative", my: 3 }}>
            <Divider />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "background.paper",
                px: 2,
              }}
            >
              Or continue with
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
                Google
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
                Facebook
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link to="/auth/login">
                <Typography component="span" variant="body2" color="primary" fontWeight="medium">
                  Log in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default SignupPage
