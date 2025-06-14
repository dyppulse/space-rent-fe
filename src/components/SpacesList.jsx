import React from 'react';
import { Link } from 'react-router-dom';
import {
  Backdrop,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpace } from '../redux/slices/spaceSlice';
import { useState } from 'react';

function SpacesList({ spaces }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.spaces)

  const handleMenuOpen = (event, spaceId) => {
    setAnchorEl(event.currentTarget);
    setSelectedSpaceId(spaceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSpaceId(null);
  };

  const deleteMySpace = (id) => {
    setAnchorEl(null);
    setSelectedSpaceId(null);
    dispatch(deleteSpace(id))
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  console.log(spaces, "dklddldjdkdjk")
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {spaces.map((space) => (
        <Card key={space.id} variant="outlined" sx={{ overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            {console.log(space?.images, "djdhdjhdjdhjdhj")}
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
                  <img
                    src={space?.images?.[0]?.url ?? '/placeholder.svg'}
                    alt={space?.name}
                  />
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box>
                      <Typography variant="h6" component="h3">
                        {space.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {space.location.address}
                      </Typography>
                    </Box>
                    <IconButton
                      aria-label="more"
                      onClick={(e) => handleMenuOpen(e, space.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
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

                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}
                  >
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
                      pt: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: 1,
                      borderColor: 'divider',
                      // mt: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" component="span">
                        shs {space.price.amount}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.secondary"
                      >
                        /{space.price.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        component={Link}
                        to={`/dashboard/spaces/${space.id}/edit`}
                        variant="outlined"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        component={Link}
                        to={`/spaces/${space.id}`}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          component={Link}
          to={`/spaces/${selectedSpaceId}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          to={`/dashboard/spaces/${selectedSpaceId}/edit`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => deleteMySpace(selectedSpaceId)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Space Deleted successfully! Your new space has been removed from your
          listings.
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: theme => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <span>deleting....</span>
      </Backdrop>
    </Box>
  );
}

export default SpacesList;
