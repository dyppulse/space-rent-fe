import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

function DashboardSkeleton() {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Grid key={idx} item size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
      <Skeleton height={48} width="50%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
    </Box>
  )
}

export default DashboardSkeleton
