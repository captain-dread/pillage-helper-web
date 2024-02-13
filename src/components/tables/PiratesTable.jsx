import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function PiratesTable({ results }) {
  const pirates = [...results.pirates].sort((a, b) => b.battles - a.battles);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
      <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Battles</TableCell>
            <TableCell align="right">Lavish Lockers</TableCell>
            <TableCell align="right">Kraken Blood Shares</TableCell>
            <TableCell align="right">Booty Share Adjustment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pirates.map((pirate) => (
            <TableRow
              key={pirate.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {pirate.name}
              </TableCell>
              <TableCell align="right">{pirate.battles}</TableCell>
              <TableCell align="right">{pirate.greedyHits}</TableCell>
              <TableCell align="right">{pirate.krakenShares}</TableCell>
              <TableCell align="right">{pirate.bootyShareAdjustment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
