import { Box, Typography, Button, Divider } from "@mui/material";
import { useState } from "react";

export default function BattleResultsCounter() {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const handleWin = () => {
    setWins(wins + 1);
  };

  const handleLoss = () => {
    setLosses(losses + 1);
  };

  const handleReset = () => {
    setWins(0);
    setLosses(0);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
        <Divider variant="middle" sx={{ width: 100 }} />
      </Box>
      <Box textAlign="center">
        <Typography
          style={{ fontFamily: '"Orbitron", sans-serif' }}
          fontSize={16}
        >
          Battle Results
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" m={1}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleWin}
          >
            Win
          </Button>
          <Typography variant="h5" style={{ margin: "0 20px" }}>
            {wins} - {losses}
          </Typography>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={handleLoss}
          >
            Loss
          </Button>
        </Box>
        <Button variant="text" size="small" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </>
  );
}
