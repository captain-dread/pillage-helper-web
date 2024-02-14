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
  Typography,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
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
  p: 1.5,
};

export default function BasicModal({ results, deleteBattle }) {
  const [open, setOpen] = React.useState(false);
  const [alignment, setAlignment] = React.useState("battles");

  const [sortOption, setSortOption] = React.useState("battles");
  const [sortedPirates, setSortedPirates] = React.useState([]);

  React.useEffect(() => {
    let sorted = [];
    if (sortOption === "battles") {
      sorted = [...results.pirates].sort((a, b) => b.battles - a.battles);
    } else if (sortOption === "lavishLockers") {
      sorted = [...results.pirates].sort((a, b) => b.greedyHits - a.greedyHits);
    }
    setSortedPirates(sorted);
  }, [sortOption, results.pirates]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        onClick={handleOpen}
        sx={{ mb: 2, mt: 0.5 }}
      >
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
          <Box sx={{ mt: 0.5, mb: 1.5 }}>
            <Typography sx={{ fontSize: 13, pl: 1 }}>
              Overall Summary
            </Typography>
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
                      {results.poe.toLocaleString()}
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
            <Typography sx={{ fontSize: 13, pl: 1 }}>
              "List Of All Battles"
            </Typography>
          ) : (
            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}
            >
              <Typography sx={{ fontSize: 13, pl: 1 }}>
                All Participating Pirates
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  setSortOption("battles");
                }}
                sx={{ fontSize: ".7rem" }}
              >
                Battles <SortIcon size="small" sx={{ pl: 0.5 }} />
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setSortOption("lavishLockers");
                }}
                sx={{ fontSize: ".7rem" }}
              >
                Lavish Lockers <SortIcon size="small" sx={{ pl: 0.5 }} />
              </Button>
            </Box>
          )}
          {alignment === "battles" ? (
            <BattleResultsTable results={results} deleteBattle={deleteBattle} />
          ) : (
            <PiratesTable sortedPirates={sortedPirates} />
          )}
        </Box>
      </Modal>
    </div>
  );
}
