import React from "react";
import LinearProgress from "@mui/material/LinearProgress";

const CustomProgressBar = ({ value }) => {
  let color;

  if (value <= 30) {
    color = "green";
  } else if (value <= 70) {
    color = "yellow";
  } else {
    color = "red";
  }

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 10,
        backgroundColor: "rgba(0,0,0,0.1)",
        ".MuiLinearProgress-bar": {
          backgroundColor: color,
        },
        borderRadius: 5,
        m: 1,
      }}
    />
  );
};

export default CustomProgressBar;
