import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

function DetailSkeleton() {
  return (
    <Grid container spacing={4}>
      <Grid item size={{ xs: 12, md: 8 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 2 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid key={idx} item size={{ xs: 6, sm: 3 }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Skeleton height={40} width="40%" />
          <Skeleton height={20} width="90%" />
          <Skeleton height={20} width="85%" />
          <Skeleton height={20} width="80%" />
        </Box>
      </Grid>
      <Grid item size={{ xs: 12, md: 4 }}>
        <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
      </Grid>
    </Grid>
  )
}

export default DetailSkeleton
