import { Link } from 'react-router-dom'
import { Box, Typography, IconButton, useTheme } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StarIcon from '@mui/icons-material/Star'

function SpaceCard({ space }) {
  const theme = useTheme()

  // Format price with commas
  const formattedPrice = space.price?.amount?.toLocaleString() || '0'
  const priceUnit = space.price?.unit || 'event'

  // Format location (show district or city if available)
  // Ensure we never accidentally display the space ID
  const location =
    space.location?.district ||
    space.location?.city ||
    space.location?.address ||
    space.location?.region ||
    space.location?.parish ||
    ''

  // If location is empty or looks like an ID (long alphanumeric), show fallback
  const displayLocation =
    location && !location.match(/^[a-f0-9]{20,}$/i) ? location : 'Location not specified'

  // Get rating or default
  const rating = space.rating || 0

  return (
    <Box
      component={Link}
      to={`/spaces/${space.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%', // 4:3 aspect ratio
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'grey.200',
          mb: 1.5,
        }}
      >
        <Box
          component="img"
          src={space.images?.[0]?.url || '/placeholder.svg'}
          alt={space.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Rating Badge */}
        {rating > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
            }}
          >
            <StarIcon sx={{ fontSize: 14, color: 'white' }} />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: 'white', fontSize: '0.875rem' }}
            >
              {rating.toFixed(1)}
            </Typography>
          </Box>
        )}

        {/* Favorite Button */}
        <IconButton
          onClick={(e) => {
            e.preventDefault()
            // TODO: Implement favorite functionality
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor:
              theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)',
            color: theme.palette.mode === 'dark' ? 'white' : 'black',
            width: 32,
            height: 32,
            backdropFilter: 'blur(8px)',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'white',
              transform: 'scale(1.1)',
            },
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Title */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {space.name}
        </Typography>

        {/* Location */}
        {displayLocation && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {displayLocation}
          </Typography>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            UGX {formattedPrice}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /{priceUnit}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SpaceCard
