import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

function createData(name, value) {
  return { name, value };
}

export default function ShipMetaInformation({
  ship,
  identity,
  battle,
  expandShipInfo,
}) {
  const getPillageMax = () => {
    if (identity === "player") {
      return battle.playerShip.maxPillageDamage[battle.enemyShip.cannonSize];
    } else {
      return battle.enemyShip.maxPillageDamage[battle.playerShip.cannonSize];
    }
  };

  const rows = [
    createData("Moves per turn", ship.movesPerTurn),
    createData("Shots per move", ship.shotsPerMove),
    createData("Cannon size", ship.cannonSize),
    createData(
      "Maxed at",
      `${getPillageMax()} cb${getPillageMax() > 1 ? "'s" : ""}`
    ),
    createData("Max pirates", ship.maxPirates),
    ...(expandShipInfo
      ? [
          createData("Max swabbies", ship.maxSwabbies),
          createData("Mass", ship.mass.toLocaleString()),
          createData("Volume", ship.volume.toLocaleString()),
        ]
      : []),
  ];

  return (
    <TableContainer sx={{ p: 0 }}>
      <Table size="small" aria-label="a dense table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row" sx={{ p: 0, pl: 1 }}>
                <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {row.name}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ p: 0, pr: 1 }}>
                <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {row.value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
