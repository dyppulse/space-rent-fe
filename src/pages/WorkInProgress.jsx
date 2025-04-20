// components/WorkInProgress.js
import { Box, Typography } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const WorkInProgress = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      px={2}
    >
      <ConstructionIcon color="warning" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h4" color="warning.main" gutterBottom>
        Work In Progress
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is currently under construction. Please check back later!
      </Typography>
    </Box>
  );
};

export default WorkInProgress;
