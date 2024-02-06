import { Box, Typography } from "@mui/material";

export default function Booty({ setResults, results }) {
  return (
    <Box
      sx={{
        backgroundColor: "#393939",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        mb: 1,
        borderRadius: 1,
        minWidth: 285,
        px: 1,
        py: 0.5,
        gap: 2,
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
          {results.commodities}
        </Typography>
        <img
          src="./icons/commodities.png"
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
        <Typography sx={{ pr: 0.5, color: "green", fontSize: 14 }}>
          {results.wins}
        </Typography>
        <Counter reference="wins" setResults={setResults} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ pr: 0.5, color: "red", fontSize: 14 }}>
          {results.losses}
        </Typography>
        <Counter reference="losses" setResults={setResults} />
      </Box>
    </Box>
  );
}

function Counter({ reference, setResults }) {
  const updateResults = (operation) => {
    setResults((R) => {
      const newValue =
        operation === "increment" ? R[reference] + 1 : R[reference] - 1;
      return {
        ...R,
        [reference]: newValue,
      };
    });
  };

  return (
    <Box>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 14,
          lineHeight: "1",
          cursor: "pointer",
        }}
        onClick={() => updateResults("increment")}
      >
        +
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 16,
          lineHeight: "1",
          cursor: "pointer",
        }}
        onClick={() => updateResults("decrement")}
      >
        -
      </Typography>
    </Box>
  );
}
