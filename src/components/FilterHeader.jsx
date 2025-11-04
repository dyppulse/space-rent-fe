import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Container,
  MenuItem,
  ClickAwayListener,
  Popper,
  Fade,
  Paper,
  Chip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import HomeWorkIcon from '@mui/icons-material/HomeWork'

// Format price for display
const formatPrice = (price) => {
  if (price >= 1000000) {
    return `UGX ${(price / 1000000).toFixed(1)}M`
  }
  if (price >= 1000) {
    return `UGX ${(price / 1000).toFixed(0)}K`
  }
  return `UGX ${price}`
}

function FilterHeader({
  onToggleTheme,
  mode,
  // Filter props
  searchTerm,
  onSearchChange,
  spaceType,
  onSpaceTypeChange,
  location,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  // Options
  spaceTypes,
  locations,
}) {
  const [spaceTypeAnchor, setSpaceTypeAnchor] = useState(null)
  const [locationAnchor, setLocationAnchor] = useState(null)
  const [priceAnchor, setPriceAnchor] = useState(null)

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={(theme) => ({
          backdropFilter: 'blur(20px)',
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 56, md: 64 },
              px: { xs: 1, md: 0 },
              py: 0.5,
              gap: 1,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            {/* Compact Brand */}
            <Box
              component={Link}
              to="/spaces"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: { xs: 0.5, md: 2 },
                flexShrink: 0,
                order: { xs: 1, md: 1 },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                <HomeWorkIcon sx={{ fontSize: 18, color: 'white' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #51c765 0%, #238636 100%)'
                      : 'linear-gradient(135deg, #238636 0%, #51c765 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Spaces
              </Typography>
            </Box>

            {/* Search Input - Takes flex space */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                minWidth: 0,
                order: { xs: 2, md: 2 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <TextField
                placeholder="Search spaces..."
                variant="standard"
                fullWidth
                value={searchTerm}
                onChange={onSearchChange}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '0.875rem',
                  },
                }}
                sx={{ flex: 1 }}
              />
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.5, display: { xs: 'none', md: 'block' }, order: { xs: 3, md: 3 } }}
            />

            {/* Space Type Filter - Now visible on md+ */}
            <ClickAwayListener onClickAway={() => setSpaceTypeAnchor(null)}>
              <Box sx={{ display: { xs: 'none', md: 'block' }, order: { xs: 4, md: 4 } }}>
                <Button
                  variant={spaceType !== 'all' ? 'contained' : 'text'}
                  size="small"
                  onClick={(e) => setSpaceTypeAnchor(spaceTypeAnchor ? null : e.currentTarget)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    color: spaceType !== 'all' ? 'primary.contrastText' : 'text.primary',
                    fontWeight: spaceType !== 'all' ? 600 : 400,
                    minWidth: 'auto',
                    bgcolor: spaceType !== 'all' ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: spaceType !== 'all' ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  {spaceTypes.find((t) => t.value === spaceType)?.label || 'All Types'}
                </Button>
                <Popper
                  open={Boolean(spaceTypeAnchor)}
                  anchorEl={spaceTypeAnchor}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper elevation={8} sx={{ mt: 0.5, minWidth: 180, borderRadius: 2 }}>
                        <Box sx={{ p: 0.5 }}>
                          {spaceTypes.map((type) => (
                            <MenuItem
                              key={type.value}
                              selected={spaceType === type.value}
                              onClick={() => {
                                onSpaceTypeChange(type.value)
                                setSpaceTypeAnchor(null)
                              }}
                              sx={{
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                '&.Mui-selected': {
                                  bgcolor: 'primary.main',
                                  color: 'primary.contrastText',
                                  '&:hover': {
                                    bgcolor: 'primary.dark',
                                  },
                                },
                              }}
                            >
                              {type.label}
                            </MenuItem>
                          ))}
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>

            {/* Location Filter - Now visible on md+ */}
            <ClickAwayListener onClickAway={() => setLocationAnchor(null)}>
              <Box sx={{ display: { xs: 'none', md: 'block' }, order: { xs: 5, md: 5 } }}>
                <Button
                  variant={location ? 'contained' : 'text'}
                  size="small"
                  startIcon={<LocationOnIcon sx={{ fontSize: 18 }} />}
                  onClick={(e) => setLocationAnchor(locationAnchor ? null : e.currentTarget)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    color: location ? 'primary.contrastText' : 'text.primary',
                    fontWeight: location ? 600 : 400,
                    minWidth: 'auto',
                    bgcolor: location ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: location ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  {location || 'Anywhere'}
                </Button>
                <Popper
                  open={Boolean(locationAnchor)}
                  anchorEl={locationAnchor}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper
                        elevation={8}
                        sx={{
                          mt: 0.5,
                          minWidth: 220,
                          maxHeight: 300,
                          overflow: 'auto',
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ p: 0.5 }}>
                          {locations.map((loc) => (
                            <MenuItem
                              key={loc}
                              selected={location === loc}
                              onClick={() => {
                                onLocationChange(location === loc ? '' : loc)
                                setLocationAnchor(null)
                              }}
                              sx={{
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                '&.Mui-selected': {
                                  bgcolor: 'primary.main',
                                  color: 'primary.contrastText',
                                  '&:hover': {
                                    bgcolor: 'primary.dark',
                                  },
                                },
                              }}
                            >
                              {loc}
                            </MenuItem>
                          ))}
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>

            {/* Price Filter - Now visible on md+ */}
            <ClickAwayListener onClickAway={() => setPriceAnchor(null)}>
              <Box sx={{ display: { xs: 'none', md: 'block' }, order: { xs: 6, md: 6 } }}>
                <Button
                  variant={priceRange[0] > 0 || priceRange[1] < 10000000 ? 'contained' : 'text'}
                  size="small"
                  startIcon={<AttachMoneyIcon sx={{ fontSize: 18 }} />}
                  onClick={(e) => setPriceAnchor(priceAnchor ? null : e.currentTarget)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    color:
                      priceRange[0] > 0 || priceRange[1] < 10000000
                        ? 'primary.contrastText'
                        : 'text.primary',
                    fontWeight: priceRange[0] > 0 || priceRange[1] < 10000000 ? 600 : 400,
                    minWidth: 'auto',
                    bgcolor:
                      priceRange[0] > 0 || priceRange[1] < 10000000
                        ? 'primary.main'
                        : 'transparent',
                    '&:hover': {
                      bgcolor:
                        priceRange[0] > 0 || priceRange[1] < 10000000
                          ? 'primary.dark'
                          : 'action.hover',
                    },
                  }}
                >
                  {priceRange[0] > 0 || priceRange[1] < 10000000
                    ? `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`
                    : 'Any price'}
                </Button>
                <Popper
                  open={Boolean(priceAnchor)}
                  anchorEl={priceAnchor}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper elevation={8} sx={{ mt: 0.5, p: 2, minWidth: 300, borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Price Range
                        </Typography>
                        <Box sx={{ px: 1, py: 2 }}>
                          <TextField
                            label="Min"
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) =>
                              onPriceRangeChange([Number(e.target.value) || 0, priceRange[1]])
                            }
                            size="small"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                            }}
                            sx={{ width: '100%', mb: 1 }}
                          />
                          <TextField
                            label="Max"
                            type="number"
                            value={priceRange[1] === 10000000 ? '' : priceRange[1]}
                            onChange={(e) =>
                              onPriceRangeChange([
                                priceRange[0],
                                Number(e.target.value) || 10000000,
                              ])
                            }
                            size="small"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                            }}
                            sx={{ width: '100%' }}
                          />
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>

            {/* Theme Toggle */}
            <IconButton
              onClick={onToggleTheme}
              size="small"
              sx={{
                width: 36,
                height: 36,
                ml: { xs: 0.5, md: 1 },
                order: { xs: 7, md: 7 },
              }}
            >
              {mode === 'dark' ? (
                <LightModeIcon fontSize="small" />
              ) : (
                <DarkModeIcon fontSize="small" />
              )}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default FilterHeader
