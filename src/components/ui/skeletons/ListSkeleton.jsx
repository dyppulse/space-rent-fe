import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'

function ListSkeleton({ items = 6 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: items }).map((_, idx) => (
        <Grid key={idx} item size={{ xs: 12, sm: 6, md: 4 }}>
          <Box>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
            <Skeleton height={28} width="70%" />
            <Skeleton height={20} width="60%" />
            <Skeleton height={20} width="50%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default ListSkeleton
