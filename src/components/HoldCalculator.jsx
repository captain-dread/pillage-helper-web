import { useEffect, useState } from "react";
import { Box, Button, Modal, LinearProgress, Typography } from "@mui/material";
import SelectShipInput from "./atoms/SelectShipInput.jsx";
import MultipleSelect from "./atoms/MultipleSelect.jsx";
import Slider from "./atoms/Slider.jsx";

import { ships } from "../assets/ships.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "clamp(400px, 90vw, 800px)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  py: 4,
  px: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function HoldCalculatorModal() {
  const [shipHold, setShipHold] = useState({
    mass: 0,
    volume: 0,
    commodities: {},
  });
  const [commoditiesSelected, setCommoditiesSelected] = useState({
    "Basic Commodity": [],
    Herbs: [],
    Minerals: [],
    Forageables: [],
    "Ship Supplies": [],
    Cloth: [],
    Dyes: [],
    Enamels: [],
    Paints: [],
  });
  const [open, setOpen] = useState(false);
  const [ship, setShip] = useState(ships[0]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const selectedCommodities = Object.values(commoditiesSelected).flat();

  // Update progress bar color based on total mass/volume
  const calculateProgressColor = (value) =>
    value <= 40 ? "green" : value <= 65 ? "yellow" : "red";
  const progressBarColorMass = calculateProgressColor(
    (shipHold.mass / ship.mass) * 100
  );
  const progressBarColorVolume = calculateProgressColor(
    (shipHold.volume / ship.volume) * 100
  );

  const handleSliderChange = (commodity, newValue) => {
    const newMass = newValue * commodity.mass;
    const newVolume = newValue * commodity.volume;
    const oldMass = shipHold.commodities[commodity.resource]?.mass || 0;
    const oldVolume = shipHold.commodities[commodity.resource]?.volume || 0;

    // Update only if within ship capacity
    if (
      shipHold.mass - oldMass + newMass <= ship.mass &&
      shipHold.volume - oldVolume + newVolume <= ship.volume
    ) {
      setShipHold((prev) => ({
        mass: prev.mass - oldMass + newMass,
        volume: prev.volume - oldVolume + newVolume,
        commodities: {
          ...prev.commodities,
          [commodity.resource]: {
            quantity: newValue,
            mass: newMass,
            volume: newVolume,
          },
        },
      }));
    }
  };

  useEffect(() => {
    setShipHold({ mass: 0, volume: 0, commodities: {} }); // Reset on ship change
  }, [ship]);

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        onClick={handleOpen}
        sx={{ mb: 2, mt: 0.5 }}
      >
        Hold Calculator
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="hold-calculator"
        aria-describedby="hold-calculator-model"
      >
        <Box sx={style}>
          <Typography textAlign="center">Hold Calculator</Typography>
          {/* Ship Selection and Display */}
          <SelectShipInput
            ships={ships}
            currentShip={ship}
            handleShipChange={setShip}
            calculatorSelect={true}
          />
          <Box
            sx={{
              height: 70,
              width: 80,
              mt: 0.5,
              backgroundImage: `url(${ship.imagePath})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />

          {/* Mass and Volume Progress Bars */}
          <Box
            sx={{ pt: 1, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Box sx={{ width: "100px" }}>
              <Typography sx={{ fontSize: ".8rem" }}>Mass</Typography>
              <LinearProgress
                variant="determinate"
                value={(shipHold.mass / ship.mass) * 100}
                sx={{
                  width: "100%",
                  height: "2rem",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: progressBarColorMass,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "100px" }}>
              <Typography sx={{ fontSize: ".8rem" }}>Volume</Typography>
              <LinearProgress
                variant="determinate"
                value={(shipHold.volume / ship.volume) * 100}
                sx={{
                  width: "100%",
                  height: "2rem",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: progressBarColorVolume,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Commodity Selection and Sliders */}
          <MultipleSelect
            commoditiesSelected={commoditiesSelected}
            setCommoditiesSelected={setCommoditiesSelected}
          />
          <Box
            sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
          >
            {selectedCommodities.map((commodity) => {
              const maxByMass = Math.floor(ship.mass / commodity.mass);
              const maxByVolume = Math.floor(ship.volume / commodity.volume);
              const maxValue = Math.min(maxByMass, maxByVolume);
              const currentValue =
                shipHold.commodities[commodity.resource]?.quantity || 0;

              return (
                <Box key={commodity.resource} sx={{ m: 1 }}>
                  <Slider
                    value={currentValue}
                    maxValue={maxValue}
                    onChange={(value) => handleSliderChange(commodity, value)}
                    label={commodity.resource}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
