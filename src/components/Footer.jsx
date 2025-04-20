import { Link } from "react-router-dom"
import { Box, Container, Grid, Typography, Link as MuiLink } from "@mui/material"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item size={{xs:12, md: 3}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              SpaceHire
            </Typography>
            <Typography variant="body2" color="grey.400" paragraph>
              Find and book unique venues for your next event.
            </Typography>
          </Grid>

          <Grid item size={{xs: 12, sm: 6, md:3}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Explore
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/spaces" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  All Spaces
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/spaces?type=event"
                  color="grey.400"
                  sx={{ "&:hover": { color: "white" } }}
                >
                  Event Venues
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/spaces?type=studio"
                  color="grey.400"
                  sx={{ "&:hover": { color: "white" } }}
                >
                  Studios
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/spaces?type=conference"
                  color="grey.400"
                  sx={{ "&:hover": { color: "white" } }}
                >
                  Conference Rooms
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          <Grid item size={{xs:12, sm: 6, md: 3}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Host
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/host" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  List Your Space
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/host/resources" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  Resources
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/host/guidelines" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  Guidelines
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          <Grid item size={{xs: 12, sm: 6, md: 3}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/about" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  About Us
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/contact" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  Contact
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/privacy" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  Privacy Policy
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/terms" color="grey.400" sx={{ "&:hover": { color: "white" } }}>
                  Terms of Service
                </MuiLink>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "grey.800", textAlign: "center" }}>
          <Typography variant="body2" color="grey.400">
            &copy; {currentYear} SpaceHire. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
