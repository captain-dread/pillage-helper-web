import * as React from "react";
import Box from "@mui/material/Box";
import MuiSlider from "@mui/material/Slider"; // Renamed to avoid naming conflict
import Typography from "@mui/material/Typography";

export default function SliderSizes({ value, maxValue, onChange, label }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ width: 300, display: "flex", alignItems: "center" }}>
      <Typography sx={{ fontSize: ".8rem", pr: 0.5, textAlign: "center" }}>
        {label}
      </Typography>
      <MuiSlider
        size="small"
        defaultValue={0}
        aria-label="Small"
        valueLabelDisplay="on"
        max={maxValue}
        value={value}
        onChange={handleChange}
      />
      <Typography sx={{ fontSize: ".9rem", px: 1 }}>{maxValue}</Typography>
    </Box>
  );
}
