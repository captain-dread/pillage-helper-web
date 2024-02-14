import { Box, Typography, Paper } from "@mui/material";

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
      }}
    >
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
        <Typography sx={{ pr: 0.5, fontSize: 14 }}>{results.wins}W</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ pr: 0.5, fontSize: 14 }}>
          {results.losses}L
        </Typography>
      </Box>
    </Paper>
  );
}
