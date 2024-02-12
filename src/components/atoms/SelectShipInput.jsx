import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectSmall({
  identity,
  currentShip,
  ships,
  handleShipChange,
}) {
  const handleChange = (event) => {
    const selectedShip = ships.find(
      (item) => item.shipType === event.target.value
    );
    if (selectedShip) {
      handleShipChange(identity, selectedShip);
    }
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="select-ship" sx={{ fontSize: "0.7rem" }}>
        {identity}
      </InputLabel>
      <Select
        labelId="select-ship"
        id="demo-select-small"
        value={currentShip.shipType}
        label="Ship"
        onChange={handleChange}
        sx={{
          fontSize: "0.7rem",
          "& .MuiMenuItem-root": { fontSize: "0.7rem" },
        }}
      >
        {ships.map((shipOption, i) => (
          <MenuItem
            key={i}
            value={shipOption.shipType}
            sx={{ fontSize: "0.7rem" }}
          >
            {shipOption.shipType}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
