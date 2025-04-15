"use client"
import { Link } from "react-router-dom"
import { Box, Container, Typography, TextField, Button, Paper, Divider, Grid } from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import FacebookIcon from "@mui/icons-material/Facebook"

function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Log in to your account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your email and password to access your space owner dashboard
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" component="label" htmlFor="password">
              Password
            </Typography>
            <Link to="/auth/forgot-password">
              <Typography variant="body2" color="primary">
                Forgot password?
              </Typography>
            </Link>
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3, mb: 2 }}>
            Log in
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
              Don't have an account?{" "}
              <Link to="/auth/signup">
                <Typography component="span" variant="body2" color="primary" fontWeight="medium">
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage
