import { Grid } from '@mui/material'
import SpaceCard from './SpaceCard'

function SpaceGrid({ spaces }) {
  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
      {spaces?.map((space) => (
        <Grid item key={space.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <SpaceCard space={space} />
        </Grid>
      ))}
    </Grid>
  )
}

export default SpaceGrid
