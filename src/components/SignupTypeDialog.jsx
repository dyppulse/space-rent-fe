import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

function SignupTypeDialog({ open, onClose }) {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)

  const handleSelect = (type) => {
    setSelectedType(type)
    // Close dialog and navigate after a brief delay for visual feedback
    setTimeout(() => {
      onClose()
      if (type === 'client') {
        navigate('/auth/signup')
      } else {
        navigate('/auth/signup/owner')
      }
    }, 300)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Choose Your Account Type
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <DialogContentText sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          How would you like to use SpaceHire?
        </DialogContentText>

        <Grid container spacing={2}>
          {/* Client Option */}
          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => handleSelect('client')}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 2,
                borderColor: selectedType === 'client' ? 'primary.main' : 'divider',
                bgcolor: selectedType === 'client' ? 'rgba(35, 134, 54, 0.05)' : 'background.paper',
                position: 'relative',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: selectedType === 'client' ? 'primary.main' : 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <PersonIcon sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  I'm a Client
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  I want to book spaces for events and meetings
                </Typography>
                {selectedType === 'client' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CheckCircleIcon sx={{ color: 'primary.main' }} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Owner Option */}
          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => handleSelect('owner')}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 2,
                borderColor: selectedType === 'owner' ? 'primary.main' : 'divider',
                bgcolor: selectedType === 'owner' ? 'rgba(35, 134, 54, 0.05)' : 'background.paper',
                position: 'relative',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: selectedType === 'owner' ? 'primary.main' : 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  I'm an Owner
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  I want to list my spaces and earn money
                </Typography>
                {selectedType === 'owner' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CheckCircleIcon sx={{ color: 'primary.main' }} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Already have an account?{' '}
            <Button
              size="small"
              onClick={() => {
                onClose()
                navigate('/auth/login')
              }}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Log in
            </Button>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SignupTypeDialog
