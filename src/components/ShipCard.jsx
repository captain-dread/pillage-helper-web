import * as React from "react";
import {
  Card,
  CardContent,
  Box,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import ShipMetaInformation from "./atoms/ShipMetaInformation";
import SelectShipInput from "./atoms/SelectShipInput";
import DamageTracker from "./atoms/DamageTracker";

import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

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
  expandShipInfo,
  toggleExpandShipInfo,
  battleType,
  toggleBattleType,
}) {
  return (
    <Card sx={{ maxWidth: 250, p: 0 }} elevation={3}>
      <CardContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
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
        <IconButton
          size="small"
          sx={{ position: "absolute", bottom: 10, right: 5 }}
          onClick={toggleExpandShipInfo}
        >
          <InfoOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </CardContent>
      <CardContent sx={{ p: 0.5, paddingBottom: "5px !important" }}>
        <ShipMetaInformation
          ship={ship}
          battle={battle}
          identity={identity}
          expandShipInfo={expandShipInfo}
        />

        <Stack direction="column" spacing={0.5} sx={{ p: 0.5 }}>
          <Box sx={{ display: "flex" }}>
            <IconButton
              aria-label="undo"
              size="small"
              onClick={() => {
                recordShotsTaken(identity, 1, true);
              }}
            >
              <SettingsBackupRestoreIcon sx={{ fontSize: 12 }} />
            </IconButton>
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
          </Box>
          <Box sx={{ display: "flex" }}>
            <IconButton
              aria-label="undo"
              size="small"
              onClick={() => {
                recordShotsTaken(identity, 2, true);
              }}
            >
              <SettingsBackupRestoreIcon sx={{ fontSize: 12 }} />
            </IconButton>
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
          </Box>
          <Box sx={{ display: "flex" }}>
            <IconButton
              aria-label="undo"
              size="small"
              onClick={() => {
                recordRockDamage(identity, true);
              }}
            >
              <SettingsBackupRestoreIcon sx={{ fontSize: 12 }} />
            </IconButton>
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
          </Box>
        </Stack>

        <DamageTracker
          getShipDamageStatus={getShipDamageStatus}
          getDamage={getDamage}
          identity={identity}
          battleType={battleType}
          toggleBattleType={toggleBattleType}
        />
      </CardContent>
    </Card>
  );
}

const buttonStyle = {
  padding: "0px 4px",
  fontSize: 12,
  display: "flex",
  justifyContent: "center",
  flex: 1,
};
