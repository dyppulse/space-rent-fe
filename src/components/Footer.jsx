import { Box, Container, Grid, Typography, Link as MuiLink, Divider } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import HomeWorkIcon from '@mui/icons-material/HomeWork'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: 'white', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Brand Section */}
          <Grid item size={{ xs: 12, md: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
              <HomeWorkIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(45deg, #4ade80 30%, #51c765 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Spaces
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'grey.400',
                mb: 3,
                lineHeight: 1.7,
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Connect with unique event spaces across Uganda. Book your perfect venue for any
              occasion.
            </Typography>

            {/* Contact Info */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(35, 134, 54, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmailIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                </Box>
                <MuiLink
                  href="mailto:dyppulse@gmail.com"
                  sx={{
                    color: 'grey.300',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.light' },
                  }}
                >
                  dyppulse@gmail.com
                </MuiLink>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(35, 134, 54, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                </Box>
                <MuiLink
                  href="tel:+256775681668"
                  sx={{
                    color: 'grey.300',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.light' },
                  }}
                >
                  +256 775 681 668
                </MuiLink>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(35, 134, 54, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'grey.300', fontSize: '0.875rem' }}>
                  Kampala, Uganda
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'grey.400', fontSize: '0.875rem' }}>
            &copy; {currentYear} Spaces. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500', fontSize: '0.875rem' }}>
            Made with ❤️ in Uganda
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
