import { Grid } from "@mui/material"
import SpaceCard from "./SpaceCard"

function SpaceGrid({ spaces }) {
  return (
    <Grid container spacing={3}>
      {spaces.map((space) => (
        <Grid item key={space.id} xs={12} sm={6} md={4}>
          <SpaceCard space={space} />
        </Grid>
      ))}
    </Grid>
  )
}

export default SpaceGrid
