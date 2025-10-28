import { useState } from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography, Chip } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import { useAuth } from '../contexts/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../api/services/authService'
import { Snackbar, Alert } from '@mui/material'

function RoleSwitcher() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const switchRoleMutation = useMutation({
    mutationFn: (role) => authService.switchRole(role),
    onSuccess: (data) => {
      // Update the user in the query cache
      queryClient.setQueryData(['auth', 'user'], data.user)
      queryClient.setQueryData(['auth', 'status'], data)

      // Invalidate related queries to refetch with new role
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })

      setSnackbar({
        open: true,
        message: `Switched to ${data.user.activeRole} view`,
        severity: 'success',
      })
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to switch role'
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      })
    },
  })

  // Only show if user has multiple roles
  if (!user || !user.roles || user.roles.length < 2) {
    return null
  }

  const handleRoleChange = (event, newRole) => {
    if (newRole && newRole !== user.activeRole) {
      switchRoleMutation.mutate(newRole)
    }
  }

  const hasClientRole = user.roles.includes('client')
  const hasOwnerRole = user.roles.includes('owner') // Show owner option even if not verified

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          View:
        </Typography>
        <ToggleButtonGroup
          value={user.activeRole}
          exclusive
          onChange={handleRoleChange}
          size="small"
          disabled={switchRoleMutation.isPending}
        >
          {hasClientRole && (
            <ToggleButton value="client" aria-label="client view">
              <Tooltip title="View as Client">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PersonIcon fontSize="small" />
                  <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                    Client
                  </Box>
                </Box>
              </Tooltip>
            </ToggleButton>
          )}
          {hasOwnerRole && (
            <ToggleButton value="owner" aria-label="owner view">
              <Tooltip title="View as Owner">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BusinessIcon fontSize="small" />
                  <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                    Owner
                  </Box>
                </Box>
              </Tooltip>
            </ToggleButton>
          )}
        </ToggleButtonGroup>
        {user.activeRole === 'owner' && !user.isVerified && (
          <Chip
            label="Pending"
            size="small"
            color="warning"
            sx={{ height: 20, fontSize: '0.65rem' }}
          />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default RoleSwitcher
