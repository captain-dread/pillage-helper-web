import { Box, Typography, LinearProgress } from "@mui/material";

export default function DamageTracker({
  getDamage,
  getShipDamageStatus,
  identity,
  battleType,
  toggleBattleType,
}) {
  let backgroundImage =
    battleType === "brigands"
      ? "./backgrounds/sf.png"
      : "./backgrounds/rumble.png";

  const damageValue = getDamage(identity);
  const cappedValue = Math.min(damageValue, 100);

  const progressBarColor =
    cappedValue <= 40 ? "green" : cappedValue <= 65 ? "yellow" : "red";

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          sx={{ flex: 1 }}
        >
          <LinearProgress
            variant="determinate"
            value={cappedValue}
            sx={{
              width: "100%",
              height: "2rem",
              "& .MuiLinearProgress-bar": {
                backgroundColor: progressBarColor,
              },
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

        <Box
          sx={{
            width: 25,
            backgroundImage: `linear-gradient(
      ${battleType === "brigands" ? "to top" : "to bottom"}, 
      red ${cappedValue / 2}%, 
      transparent ${cappedValue / 2}%
    ), url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            ml: 0.5,
            cursor: "pointer",
          }}
          onClick={() => {
            toggleBattleType();
          }}
        ></Box>
      </Box>
      <Typography sx={{ fontSize: ".65rem" }} textAlign="center">
        {getShipDamageStatus(identity)} (received/max)
      </Typography>
    </>
  );
}
