import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  useScrollTrigger,
  Fade,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import BusinessIcon from '@mui/icons-material/Business'
import CheckIcon from '@mui/icons-material/Check'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import ConfirmDialog from './ConfirmDialog'
import RoleSwitcher from './RoleSwitcher'
import { useAuth } from '../contexts/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../api/services/authService'

function Header({ onToggleTheme, mode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, initialized } = useAuth()
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 })
  const queryClient = useQueryClient()

  const [confirm, setConfirm] = useState(false)

  // Get authentication state from context
  const isLoggedIn = !!user
  const isAdmin = user?.role === 'superadmin'

  // Role switching mutation
  const switchRoleMutation = useMutation({
    mutationFn: (role) => authService.switchRole(role),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      queryClient.setQueryData(['auth', 'status'], data)
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      handleMenuClose()
    },
  })

  const handleRoleSwitch = (role) => {
    if (role !== user?.activeRole) {
      switchRoleMutation.mutate(role)
    } else {
      handleMenuClose()
    }
  }

  // Check if user has multiple roles
  const hasMultipleRoles = user?.roles && user.roles.length > 1
  const hasClientRole = user?.roles?.includes('client')
  const hasOwnerRole = user?.roles?.includes('owner')

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Show loading state until auth is initialized
  if (!initialized) {
    return (
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              SpaceHire
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    )
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = async () => {
    setConfirm(true)
  }

  const confirmLogout = async () => {
    try {
      await logout()
      setConfirm(false)
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, redirect to login page
      setConfirm(false)
      navigate('/auth/login')
    }
  }

  // Create navLinks dynamically based on auth state and active role
  const navLinks = [
    { name: 'Home', path: isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/' },
    ...(isLoggedIn && !isAdmin && user?.activeRole === 'owner'
      ? [{ name: 'Manage Bookings', path: '/dashboard/bookings' }]
      : []),
    { name: 'Explore', path: '/spaces' },
    { name: 'How It Works', path: '/how-it-works' },
  ]

  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HomeWorkIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SpaceHire
          </Typography>
        </Box>

        {isLoggedIn && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || <PersonIcon fontSize="small" />}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {navLinks.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ px: 2, mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}

        {isLoggedIn && isAdmin && (
          <>
            <Divider sx={{ my: 2, mx: 2 }} />
            <ListItem disablePadding sx={{ px: 2, mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to="/admin"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <AdminPanelSettingsIcon sx={{ mr: 1.5 }} fontSize="small" />
                <ListItemText primary="Admin Panel" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {/* Bottom Actions */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        {isLoggedIn && (
          <Box sx={{ mb: 2 }}>
            <RoleSwitcher />
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <IconButton
            onClick={onToggleTheme}
            sx={{
              flexGrow: 1,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        {isLoggedIn ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => {
              handleDrawerToggle()
              handleLogout()
            }}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to="/auth/login"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Log in
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="success"
              component={Link}
              to="/auth/signup"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Sign up
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 4 : 0}
        sx={(theme) => ({
          backdropFilter: 'blur(20px)',
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderBottom: trigger ? `1px solid ${theme.palette.divider}` : 'none',
          transition: 'all 0.3s ease-in-out',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
        })}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 0 } }}>
            {/* Logo with Icon */}
            <Box
              component={Link}
              to={isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 5 },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(35, 134, 54, 0.3)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '12px',
                    bgcolor: 'primary.main',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    filter: 'blur(8px)',
                  },
                  '&:hover': {
                    transform: 'rotate(5deg) scale(1.05)',
                    boxShadow: '0 4px 16px rgba(35, 134, 54, 0.5)',
                    '&::before': {
                      opacity: 0.3,
                    },
                  },
                }}
              >
                <HomeWorkIcon
                  sx={{ fontSize: 24, color: 'white', position: 'relative', zIndex: 1 }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #51c765 0%, #238636 100%)'
                      : 'linear-gradient(135deg, #238636 0%, #51c765 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                SpaceHire
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                flexGrow: 1,
                gap: 0.5,
              }}
            >
              {navLinks.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={(theme) => ({
                    mx: 0.5,
                    px: 3,
                    py: 1.25,
                    borderRadius: 2.5,
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    position: 'relative',
                    color:
                      location.pathname === item.path
                        ? 'primary.main'
                        : theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(0, 0, 0, 0.8)',
                    backgroundColor:
                      location.pathname === item.path
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(35, 134, 54, 0.15)'
                          : 'rgba(35, 134, 54, 0.1)'
                        : 'transparent',
                    transition: 'all 0.2s ease',
                    '&::before':
                      location.pathname === item.path
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: 3,
                            borderRadius: '2px 2px 0 0',
                            bgcolor: 'primary.main',
                            animation: 'slideIn 0.3s ease-out',
                          }
                        : {},
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.04)',
                      transform: 'translateY(-1px)',
                    },
                  })}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Desktop Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                sx={(theme) => ({
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.04)',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                  },
                })}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {isLoggedIn && (
                <IconButton
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    '&:hover': {
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'rgba(0, 0, 0, 0.08)',
                      transform: 'scale(1.05)',
                    },
                  })}
                >
                  <Badge
                    badgeContent={0}
                    color="error"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}

              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Chip label="Admin" color="secondary" size="small" sx={{ fontWeight: 600 }} />
                  )}
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      ml: 1,
                      p: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(35, 134, 54, 0.3)',
                        border: '2px solid',
                        borderColor: 'primary.light',
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || <PersonIcon />}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/auth/login"
                    sx={(theme) => ({
                      fontWeight: 600,
                      borderRadius: 2.5,
                      px: 3,
                      py: 1,
                      transition: 'all 0.2s ease',
                      color:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(0, 0, 0, 0.8)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.04)',
                      },
                    })}
                  >
                    Log in
                  </Button>
                  <Button
                    component={Link}
                    to="/auth/signup"
                    variant="contained"
                    color="success"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2.5,
                      px: 3,
                      py: 1,
                      boxShadow: '0 2px 8px rgba(35, 134, 54, 0.3)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(35, 134, 54, 0.4)',
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: 'none' },
                ml: 1,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight={600} noWrap>
            {user?.email}
          </Typography>
        </Box>

        {isAdmin && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              navigate('/admin')
            }}
            sx={{ py: 1.5, gap: 1.5 }}
          >
            <AdminPanelSettingsIcon fontSize="small" />
            Admin Panel
          </MenuItem>
        )}

        {hasMultipleRoles && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}
              >
                View As
              </Typography>
            </Box>
            {hasClientRole && (
              <MenuItem
                onClick={() => handleRoleSwitch('client')}
                disabled={switchRoleMutation.isPending}
                sx={{ py: 1.5, gap: 1.5 }}
              >
                <PersonIcon fontSize="small" />
                <Box sx={{ flexGrow: 1 }}>Client</Box>
                {user?.activeRole === 'client' && <CheckIcon fontSize="small" color="primary" />}
              </MenuItem>
            )}
            {hasOwnerRole && (
              <MenuItem
                onClick={() => handleRoleSwitch('owner')}
                disabled={switchRoleMutation.isPending}
                sx={{ py: 1.5, gap: 1.5 }}
              >
                <BusinessIcon fontSize="small" />
                <Box sx={{ flexGrow: 1 }}>
                  Owner
                  {user?.activeRole === 'owner' && !user?.isVerified && (
                    <Chip
                      label="Pending"
                      size="small"
                      color="warning"
                      sx={{ ml: 1, height: 18, fontSize: '0.6rem' }}
                    />
                  )}
                </Box>
                {user?.activeRole === 'owner' && <CheckIcon fontSize="small" color="primary" />}
              </MenuItem>
            )}
          </>
        )}

        <Divider />

        <MenuItem
          onClick={() => {
            handleMenuClose()
            handleLogout()
          }}
          sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}
        >
          <LogoutIcon fontSize="small" />
          Logout
        </MenuItem>
      </Menu>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundImage: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      <ConfirmDialog
        open={confirm}
        title="Log out?"
        content="Do you want to log out?"
        confirmText="Log out"
        onClose={() => setConfirm(false)}
        onConfirm={confirmLogout}
      />
    </>
  )
}

export default Header
