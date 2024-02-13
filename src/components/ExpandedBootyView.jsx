import * as React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  Box,
  Modal,
  ToggleButtonGroup,
} from "@mui/material";
import BattleResultsTable from "./tables/BattleResultsTable";
import PiratesTable from "./tables/PiratesTable";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "clamp(300px, 90vw, 900px)",
  maxHeight: "90vh",
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
          <Box sx={{ mt: 0.5, mb: 1 }}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Total PoE</TableCell>
                    <TableCell>Total Lavish Lockers</TableCell>
                    <TableCell align="right">Battles Won</TableCell>
                    <TableCell align="right">Battles Lost</TableCell>
                    <TableCell align="right">Unique Pirates Jobbed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {results.poe}
                    </TableCell>
                    <TableCell align="right">{results.lavishLockers}</TableCell>
                    <TableCell align="right">{results.wins}</TableCell>
                    <TableCell align="right">{results.losses}</TableCell>
                    <TableCell align="right">
                      {results.pirates.length}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
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
