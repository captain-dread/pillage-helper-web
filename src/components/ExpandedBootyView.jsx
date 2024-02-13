import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import BattleResultsTable from "./tables/BattleResultsTable";
import PiratesTable from "./tables/PiratesTable";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "clamp(300px, 90vw, 900px)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ results, deleteBattle }) {
  const [open, setOpen] = React.useState(false);
  const [alignment, setAlignment] = React.useState("battles");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
      <Button size="small" variant="outlined" onClick={handleOpen}>
        View Booty
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
              size="small"
            >
              <ToggleButton value="battles">Battles Summary</ToggleButton>
              <ToggleButton value="pirates">Pirates Summary</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {alignment === "battles" ? (
            <BattleResultsTable results={results} deleteBattle={deleteBattle} />
          ) : (
            <PiratesTable results={results} />
          )}
        </Box>
      </Modal>
    </div>
  );
}
