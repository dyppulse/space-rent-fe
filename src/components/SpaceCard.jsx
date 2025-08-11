import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LocationOnIcon from '@mui/icons-material/LocationOn'

function SpaceCard({ space }) {
  return (
    <Card
      component={Link}
      to={`/spaces/${space.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={space.images[0]?.url || '/placeholder.svg'}
          alt={space.name}
        />
        <IconButton
          aria-label="save"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'white' },
          }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
        {space.featured && (
          <Chip
            label="Featured"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'medium',
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <Typography variant="h6" component="div" noWrap>
            {space.name}
          </Typography>
          {space.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={space.rating} precision={0.5} size="small" readOnly />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            mb: 1,
          }}
        >
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" noWrap>
            {space.location?.address}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {space.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {space.amenities.slice(0, 3).map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
          {space.amenities.length > 3 && (
            <Chip
              label={`+${space.amenities.length - 3} more`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <Box
          sx={{
            mt: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 1,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" component="span">
              UGX {space.price?.amount}
            </Typography>
            <Typography variant="body2" component="span" color="text.secondary">
              /{space.price?.unit}
            </Typography>
          </Box>
          <Chip
            label={space.spaceType}
            size="small"
            sx={{
              bgcolor: 'rgba(13, 148, 136, 0.1)',
              color: 'primary.main',
              fontWeight: 'medium',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default SpaceCard
