import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Button, Chip, Grid } from '@mui/material'

function SpacesList({ spaces }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {spaces.map((space) => (
        <Card key={space.id} variant="outlined" sx={{ overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Grid container>
              <Grid item size={{ xs: 12, sm: 4, md: 3 }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 200, sm: '100%' },
                    minHeight: { sm: 200 },
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    },
                  }}
                >
                  <img src={space?.images?.[0]?.url ?? '/placeholder.svg'} alt={space?.name} />
                  {space?.featured && (
                    <Chip
                      label="Featured"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontWeight: 'medium',
                      }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item size={{ xs: 12, sm: 8, md: 9 }}>
                <Box
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="h3">
                      {space.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {space.location?.address || 'Address not available'}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {space.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                    {space.amenities?.slice(0, 3).map((amenity) => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {space.amenities?.length > 3 && (
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
                      pt: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="h6" component="span">
                        UGX {space.price?.amount?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" component="span" color="text.secondary">
                        /{space.price?.unit || 'day'}
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      to={`/spaces/${space.id}`}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default SpacesList
