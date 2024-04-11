import { useEffect, useState } from "react";
import { Box, Button, Modal, LinearProgress, Typography } from "@mui/material";
import SelectShipInput from "./atoms/SelectShipInput.jsx";
import MultipleSelect from "./atoms/MultipleSelect.jsx";

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
  p: 4,
};

export default function HoldCalculatorModal() {
  const [shipHold, setShipHold] = useState({ mass: 0, volume: 0 });
  const [open, setOpen] = useState(false);
  const [ship, setShip] = useState(ships[0]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const progressBarColor =
    shipHold.mass <= 40 ? "green" : shipHold.mass <= 65 ? "yellow" : "red";

  useEffect(() => {
    setShipHold({ mass: 50, volume: 50 });
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
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
            <MultipleSelect />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
