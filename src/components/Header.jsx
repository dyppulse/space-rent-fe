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
import ConfirmDialog from './ConfirmDialog'
import { useAuth } from '../contexts/AuthContext'

function Header({ onToggleTheme, mode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, initialized } = useAuth()
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 })

  const [confirm, setConfirm] = useState(false)

  // Get authentication state from context
  const isLoggedIn = !!user
  const isAdmin = user?.role === 'superadmin'

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

  // Create navLinks dynamically based on auth state
  const navLinks = [
    { name: 'Home', path: isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/' },
    ...(isLoggedIn && !isAdmin ? [{ name: 'Bookings', path: '/dashboard/bookings' }] : []),
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
            theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease-in-out',
        })}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Logo with Icon */}
            <Box
              component={Link}
              to={isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 4 },
              }}
            >
              <HomeWorkIcon
                sx={{
                  fontSize: 32,
                  color: 'primary.main',
                  mr: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(10deg) scale(1.1)',
                  },
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                      : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
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
                  sx={{
                    mx: 0.5,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    backgroundColor:
                      location.pathname === item.path ? 'action.selected' : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Desktop Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <IconButton
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Chip label="Admin" color="secondary" size="small" sx={{ fontWeight: 600 }} />
                  )}
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      ml: 1,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        fontWeight: 700,
                        boxShadow: 2,
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
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 3,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
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
                      borderRadius: 2,
                      px: 3,
                      boxShadow: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
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

        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(isAdmin ? '/admin' : '/dashboard')
          }}
          sx={{ py: 1.5, gap: 1.5 }}
        >
          <DashboardIcon fontSize="small" />
          Dashboard
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate('/dashboard/bookings')
          }}
          sx={{ py: 1.5, gap: 1.5 }}
        >
          <BookOnlineIcon fontSize="small" />
          Bookings
        </MenuItem>

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
