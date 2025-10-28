import { Box, Container, Typography, Paper, Grid } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          About SpaceHire
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
          Connecting event organizers with unique, flexible spaces across Uganda
        </Typography>
      </Box>

      {/* Mission Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          At SpaceHire, we believe that every great event deserves the perfect venue. Our mission is
          to make finding and booking event spaces simple, accessible, and stress-free. Whether
          you're planning a corporate meeting, a birthday celebration, a wedding, or a community
          gathering, we connect you with verified spaces that meet your needs and budget.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          We're committed to empowering space owners by providing them with a platform to showcase
          their venues and generate additional income, while helping clients discover unique spaces
          that make their events memorable.
        </Typography>
      </Paper>

      {/* Why Choose Us Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Why Choose SpaceHire?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Transparent Pricing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No hidden fees. See the exact cost upfront, including all charges and service fees
                  before you book.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Secure Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All payments are processed securely through trusted payment gateways. Your
                  financial information is protected.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our customer support team is here to help you with any questions or issues before,
                  during, and after your booking.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Verified Reviews
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Read authentic reviews from previous clients to help you make informed decisions
                  about your venue choice.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Our Story Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Our Story
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
          SpaceHire was born from a simple observation: finding the right event space in Uganda was
          often challenging, time-consuming, and frustrating. Event organizers spent countless hours
          calling venues, visiting locations, and navigating unclear pricing structures.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
          Meanwhile, many space owners struggled to reach potential clients and fill their available
          dates. We saw an opportunity to bridge this gap by creating a platform that makes the
          entire process seamless for both sides.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
          Today, SpaceHire is Uganda's leading platform for space rentals, connecting thousands of
          event organizers with unique venues across the country. We're continuously working to
          improve our platform, expand our network of spaces, and make event planning easier for
          everyone.
        </Typography>
      </Box>

      {/* CTA Section */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Join the SpaceHire Community
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Whether you're looking to book a space or list your venue, we're here to help you succeed.
          Get started today and discover how easy event planning can be.
        </Typography>
      </Paper>
    </Container>
  )
}

export default AboutPage
