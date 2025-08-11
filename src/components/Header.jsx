import { useState } from 'react'
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
import { useEffect } from 'react'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { logout as authSliceLogout } from '../redux/slices/authSlice'

function Header({ onToggleTheme, mode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Mock authentication state - replace with actual auth later
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [localStorage.getItem('token')])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const logout = () => {
    Swal.fire({
      icon: 'question',
      title: 'Are You Sure?',
      html: 'Do you want to log out',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#CE0610',
      allowOutsideClick: false,
      reverseButtons: true,
      customClass: {
        container: 'my-swal',
      },
    }).then((value) => {
      if (value.isConfirmed) {
        localStorage.removeItem('token')
        dispatch(authSliceLogout())
        navigate('/auth/login')
      }
    })
  }

  const navLinks = [
    { name: 'Home', path: '/' },
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
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard" sx={{ textAlign: 'center' }}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
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
              to="/"
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
              to="/"
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
                  <Button component={Link} to="/dashboard" color="inherit">
                    Dashboard
                  </Button>
                  <PowerSettingsNewIcon sx={{ cursor: 'pointer' }} onClick={() => logout()} />
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
    </>
  )
}

export default Header
