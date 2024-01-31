import * as React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Button,
  Stack,
} from "@mui/material";
import ShipMetaInformation from "./ShipMetaInformation";
import SelectShipInput from "./SelectShipInput";

import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";

export default function ShipCard({
  identity,
  ship,
  ships,
  handleShipChange,
  recordShotsTaken,
  getDamage,
  recordRockDamage,
  battle,
  getShipDamageStatus,
}) {
  const damageValue = getDamage(identity);
  const cappedValue = Math.min(damageValue, 100);

  const progressBarColor =
    cappedValue <= 40 ? "green" : cappedValue <= 65 ? "yellow" : "red";

  return (
    <Card sx={{ maxWidth: 250, p: 0 }} elevation={3}>
      <CardContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SelectShipInput
          identity={identity}
          currentShip={ship}
          ships={ships}
          handleShipChange={handleShipChange}
        />
        <Box
          sx={{
            height: 50,
            width: 60,
            backgroundImage: `url(${ship.imagePath})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      </CardContent>
      <CardContent sx={{ p: 0.5, paddingBottom: "5px !important" }}>
        <ShipMetaInformation ship={ship} battle={battle} identity={identity} />

        <Stack direction="column" spacing={0.5} sx={{ p: 0.5 }}>
          <Button
            variant="text"
            size="small"
            sx={buttonStyle}
            onClick={() => {
              recordShotsTaken(identity, 1);
            }}
          >
            One Hit
            <CrisisAlertIcon size="small" sx={{ fontSize: 10, ml: 0.5 }} />
          </Button>
          <Button
            size="small"
            variant="text"
            sx={buttonStyle}
            onClick={() => {
              recordShotsTaken(identity, 2);
            }}
          >
            Two Hits
            <CrisisAlertIcon size="small" sx={{ fontSize: 10, mx: 0.5 }} />
            <CrisisAlertIcon size="small" sx={{ fontSize: 10 }} />
          </Button>
          <Button
            size="small"
            variant="text"
            sx={buttonStyle}
            onClick={() => {
              recordRockDamage(identity);
            }}
          >
            Rock/Edge Hit
          </Button>
        </Stack>

        <Box position="relative" display="flex" alignItems="center">
          <LinearProgress
            variant="determinate"
            value={cappedValue}
            sx={{
              width: "100%",
              height: "2rem",
              "& .MuiLinearProgress-bar": { backgroundColor: progressBarColor },
            }}
          />

          <Box
            position="absolute"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ height: "100%" }}
          >
            <Typography
              variant="body2"
              color="textPrimary"
              sx={{ color: "black", fontWeight: "bold" }}
            >
              {`${cappedValue}%`}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: ".65rem" }} textAlign="center">
          {getShipDamageStatus(identity)} (received/max)
        </Typography>
      </CardContent>
    </Card>
  );
}

const buttonStyle = {
  padding: "0px 4px",
  fontSize: 12,
  display: "flex",
  justifyContent: "center",
};
