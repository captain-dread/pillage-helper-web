import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BattleResultsTable({ results, deleteBattle }) {
  const battles = results.battles;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Result</TableCell>
            <TableCell align="right">PoE</TableCell>
            <TableCell align="right">Lavish Lockers</TableCell>
            <TableCell align="right">Commodities</TableCell>
            <TableCell align="right">Jobbers</TableCell>
            <TableCell align="right">Vessel Types</TableCell>
            <TableCell align="right">Fray Size</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Greedy Hits</TableCell>
            <TableCell align="right">Delete Battle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {battles.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.wonBattle ? "Victory" : "Defeat"}
              </TableCell>
              <TableCell align="right">
                {row.wonBattle ? row.poe : `-${row.poe}`}
              </TableCell>
              <TableCell align="right">
                {row.wonBattle ? row.lavishLockers : `-${row.lavishLockers}`}
              </TableCell>
              <TableCell align="right">
                {row.wonBattle ? row.commodities : `-${row.commodities}`}
              </TableCell>
              <TableCell align="right">{row.pirates.length}</TableCell>
              <TableCell align="right">
                {row.playerShip.shipType} v {row.enemyShip.shipType}
              </TableCell>
              <TableCell align="right">
                {row.playerVesselPirates} v {row.enemyVesselPirates}
              </TableCell>
              <TableCell align="right">
                {row.playerDamageTaken} - {row.enemyDamageTaken}
              </TableCell>
              <TableCell align="right">
                <Button
                  onClick={() => {
                    copyToClipboard(row.greedyHitsSummary);
                  }}
                  size="small"
                >
                  Copy
                </Button>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    deleteBattle(row.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
