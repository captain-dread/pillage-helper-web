import { Box, Typography, Paper } from "@mui/material";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Booty({ results, darkMode }) {
  return (
    <Paper
      sx={{
        backgroundColor: `${darkMode ? "#393939" : "#FFFFFF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        mb: 1,
        borderRadius: 1,
        minWidth: 285,
        py: 0.5,
        gap: 2,
        elevation: 2,
        pt: 1,
        position: "relative",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          fontSize: 9,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Booty Overview
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ pr: 0.5, fontSize: 14 }}>
          {results.poe.toLocaleString()}
        </Typography>
        <img
          src="./icons/poe.png"
          alt="poe"
          style={{ width: "15px", height: "15px" }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ pr: 0.5, fontSize: 14 }}>
          {results.lavishLockers}
        </Typography>
        <img
          src="./icons/lavish_lockers.png"
          alt="poe"
          style={{ width: "15px", height: "15px" }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: 14 }}>{results.wins}W</Typography>
        <ArrowDropUpIcon sx={{ color: "green" }} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: 14 }}>{results.losses}L</Typography>
        <ArrowDropDownIcon sx={{ color: "red" }} />
      </Box>
    </Paper>
  );
}
