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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import ConfirmDialog from './ConfirmDialog'
import { useAuth } from '../contexts/AuthContext'

function Header({ onToggleTheme, mode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, initialized } = useAuth()

  const [confirm, setConfirm] = useState(false)

  // Get authentication state from context
  const isLoggedIn = !!user
  const isAdmin = user?.role === 'superadmin'

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
    { name: 'Explore', path: '/spaces' },
    { name: 'How It Works', path: '/how-it-works' },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        SpaceHire
      </Typography>
      <Divider />
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                textAlign: 'center',
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  color: 'primary.main',
                },
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin" sx={{ textAlign: 'center' }}>
                  <ListItemText primary="Admin" />
                </ListItemButton>
              </ListItem>
            )}
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/auth/login" sx={{ textAlign: 'center' }}>
                <ListItemText primary="Log in" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/auth/signup" sx={{ textAlign: 'center' }}>
                <ListItemText primary="Sign up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={Link}
              to={isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/'}
              sx={{
                flexGrow: 1,
                display: { xs: 'none', sm: 'block' },
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              SpaceHire
            </Typography>
            <Typography
              variant="h6"
              component={Link}
              to={isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/'}
              sx={{
                flexGrow: 1,
                display: { xs: 'block', sm: 'none' },
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              SpaceHire
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {navLinks.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    position: 'relative',
                    '&::after':
                      location.pathname === item.path
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '20%',
                            width: '60%',
                            height: '2px',
                            backgroundColor: 'primary.main',
                          }
                        : {},
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, alignItems: 'center', gap: 1 }}>
              <IconButton onClick={onToggleTheme} aria-label="Toggle theme" color="inherit">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              {isLoggedIn ? (
                <Typography display={'flex'} alignItems={'center'}>
                  {isAdmin && (
                    <Button component={Link} to="/admin" color="inherit">
                      Admin
                    </Button>
                  )}
                  <PowerSettingsNewIcon sx={{ cursor: 'pointer' }} onClick={handleLogout} />
                </Typography>
              ) : (
                <>
                  <Button component={Link} to="/auth/login" color="inherit" sx={{ mr: 1 }}>
                    Log in
                  </Button>
                  <Button component={Link} to="/auth/signup" variant="contained" color="primary">
                    Sign up
                  </Button>
                </>
              )}
            </Box>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
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
