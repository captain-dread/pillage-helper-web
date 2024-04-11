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
  const [shipHold, setShipHold] = useState({ mass: 0, volume: 0 });
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

  const progressBarColor =
    shipHold.mass <= 40 ? "green" : shipHold.mass <= 65 ? "yellow" : "red";

  useEffect(() => {
    setShipHold({ mass: 50, volume: 50 });
  }, [ship]);

  useEffect(() => {
    console.log("CommoditiesSelected: ", commoditiesSelected);
  }, [commoditiesSelected]);

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "300px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
            </Box>

            <Box sx={{ pt: 1 }}>
              <Box sx={{ width: "100px" }}>
                <Typography sx={{ fontSize: ".8rem" }}>Mass</Typography>
                <LinearProgress
                  variant="determinate"
                  value={shipHold.mass}
                  sx={{
                    width: "100%",
                    height: "2rem",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: progressBarColor,
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "100px" }}>
                <Typography sx={{ fontSize: ".8rem" }}>Volume</Typography>
                <LinearProgress
                  variant="determinate"
                  value={shipHold.mass}
                  sx={{
                    width: "100%",
                    height: "2rem",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: progressBarColor,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <MultipleSelect
              commoditiesSelected={commoditiesSelected}
              setCommoditiesSelected={setCommoditiesSelected}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Slider
                value={10}
                minValue={0}
                maxValue={75}
                onChange={() => {}}
                label="Wood"
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
