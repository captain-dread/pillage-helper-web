import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Counter({ count, updateKrakenShareToBattle, id }) {
  const handleIncrease = () => {
    updateKrakenShareToBattle(id, "add");
  };

  const handleDecrease = () => {
    updateKrakenShareToBattle(id, "decrease");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ p: 0 }}
    >
      <IconButton onClick={handleDecrease} aria-label="decrease" size="small">
        <RemoveIcon fontSize="10" />
      </IconButton>
      <Typography component="span">{count}</Typography>
      <IconButton onClick={handleIncrease} aria-label="increase" size="small">
        <AddIcon fontSize="10" />
      </IconButton>
    </Box>
  );
}
