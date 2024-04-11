import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

export default function SliderSizes({
  minValue,
  value,
  maxValue,
  onChange,
  label,
}) {
  return (
    <Box sx={{ width: 300, display: "flex", alignItems: "center" }}>
      <Typography sx={{ fontSize: ".9rem", pr: 1 }}>{label}</Typography>
      <Typography sx={{ fontSize: ".9rem", px: 0.5 }}>{minValue}</Typography>
      <Slider
        size="small"
        defaultValue={0}
        aria-label="Small"
        valueLabelDisplay="auto"
        min={minValue}
        maxValue={maxValue}
        value={value}
        onChange={onChange}
      />
      <Typography sx={{ fontSize: ".9rem", px: 0.5 }}>{maxValue}</Typography>
    </Box>
  );
}
