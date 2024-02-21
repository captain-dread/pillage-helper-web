import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function PiratesTable({ sortedPirates }) {
  return (
    <TableContainer component={Paper} sx={{ height: "55vh" }}>
      <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Battles</TableCell>
            <TableCell align="right">Lavish Lockers</TableCell>
            <TableCell align="right">Kraken Blood Shares</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPirates.map((pirate) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
