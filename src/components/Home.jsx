import { useState } from "react";

import { Box, Typography, Button } from "@mui/material";
import ShipCard from "./ShipCard.jsx";
import BootyOverview from "./BootyOverview.jsx";
import BasicMenu from "./atoms/BasicMenu.jsx";
import BootyManager from "./BootyManager.jsx";

import { ships } from "../assets/ships.js";
import { getLatestBattleResult } from "../assets/booty";

export default function Home({ toggleDarkMode, darkMode }) {
  const [results, setResults] = useState({
    poe: 0,
    commodities: 0,
    lavishLockers: 0,
    krakenBloods: 0,
    wins: 0,
    losses: 0,
    pirates: [],
    battles: [],
  });

  const [battle, setBattle] = useState({
    playerShip: ships[0],
    enemyShip: ships[0],
    playerDamageTaken: 0,
    enemyDamageTaken: 0,
  });

  const [battleType, setBattleType] = useState("brigands");
  const [expandShipInfo, setExpandShipInfo] = useState(false);
  const [showBootyCounter, setShowBootyCounter] = useState(true);

  const addBattleResult = (chatLogContent, payPerGreedy) => {
    const {
      wonBattle,
      poe,
      commodities,
      lavishLockers,
      pirates: newPirates,
      greedyHitPayCommands,
      greedyHitsSummary,
    } = getLatestBattleResult(chatLogContent, payPerGreedy);

    setResults((prevState) => {
      const updatedPirates = [];
      let updatedWins = prevState.wins;
      let updatedLosses = prevState.losses;
      let updatedPOE = prevState.poe;
      let updatedCommodities = prevState.commodities;
      let updatedLavishLockers = prevState.lavishLockers;
      let updatedBattles = [...prevState.battles];

      newPirates.forEach((newPirate) => {
        const existingPirateIndex = prevState.pirates.findIndex(
          (pirate) => pirate.name === newPirate.name
        );
        if (existingPirateIndex === -1) {
          // If it's a new pirate, add them to the pirates array with battles: 1
          updatedPirates.push({ ...newPirate, battles: 1 });
        } else {
          // If it's an existing pirate, update their greedyHits and battles count
          const existingPirate = prevState.pirates[existingPirateIndex];
          const updatedGreedyHits =
            existingPirate.greedyHits + newPirate.greedyHits;

          updatedPirates.push({
            ...existingPirate,
            greedyHits: updatedGreedyHits,
            battles: existingPirate.battles + 1,
          });
        }
      });

      if (wonBattle) {
        updatedWins += 1;
      } else {
        updatedLosses += 1;
      }

      updatedPOE += poe;
      updatedCommodities += commodities;
      updatedLavishLockers += lavishLockers;

      updatedBattles.push({
        wonBattle,
        poe,
        commodities,
        lavishLockers,
        pirates: newPirates,
        greedyHitPayCommands,
        greedyHitsSummary,
      });

      return {
        ...prevState,
        wins: updatedWins,
        losses: updatedLosses,
        poe: updatedPOE,
        commodities: updatedCommodities,
        lavishLockers: updatedLavishLockers,
        pirates: updatedPirates,
        battles: updatedBattles,
      };
    });
  };

  const deleteLastBattle = () => {
    setResults((prevState) => {
      if (prevState.battles.length === 0) {
        return prevState;
      }

      const lastBattle = prevState.battles[prevState.battles.length - 1];
      const updatedPirates = prevState.pirates.map((pirate) => {
        const matchingPirateInBattle = lastBattle.pirates.find(
          (battlePirate) => battlePirate.name === pirate.name
        );
        if (matchingPirateInBattle) {
          const newGreedyHits =
            pirate.greedyHits - matchingPirateInBattle.greedyHits;
          const newBattlesCount = pirate.battles - 1;
          return {
            ...pirate,
            greedyHits: newGreedyHits,
            battles: newBattlesCount,
          };
        }
        return pirate;
      });

      return {
        ...prevState,
        wins: lastBattle.wonBattle ? prevState.wins - 1 : prevState.wins,
        losses: lastBattle.wonBattle ? prevState.losses : prevState.losses - 1,
        poe: prevState.poe - lastBattle.poe,
        commodities: prevState.commodities - lastBattle.commodities,
        lavishLockers: prevState.lavishLockers - lastBattle.lavishLockers,
        pirates: updatedPirates,
        battles: prevState.battles.slice(0, -1), // Remove the last battle
      };
    });
  };

  const toggleExpandShipInfo = () => {
    setExpandShipInfo((ESI) => !ESI);
  };

  const toggleBattleType = () => {
    setBattleType((BT) => {
      if (BT === "brigands") {
        return "barbarians";
      } else {
        return "brigands";
      }
    });
  };

  const handleShipChange = (identity, shipSelected) => {
    setBattle({
      ...battle,
      [identity === "player" ? "playerShip" : "enemyShip"]: shipSelected,
      playerDamageTaken: 0,
      enemyDamageTaken: 0,
    });
  };

  const recordShotsTaken = (identity, shots) => {
    setBattle((prevBattle) => ({
      ...prevBattle,
      [identity === "player" ? "playerDamageTaken" : "enemyDamageTaken"]:
        prevBattle[
          identity === "player" ? "playerDamageTaken" : "enemyDamageTaken"
        ] + shots,
    }));
  };

  const recordRamDamage = () => {
    setBattle({
      ...battle,
      playerDamageTaken:
        battle.playerDamageTaken +
        battle.enemyShip.ramDamage[battle.enemyShip.cannonSize],
      enemyDamageTaken:
        battle.enemyDamageTaken +
        battle.playerShip.ramDamage[battle.playerShip.cannonSize],
    });
  };

  const recordRockDamage = (identity) => {
    if (identity === "player") {
      setBattle({
        ...battle,
        playerDamageTaken:
          battle.playerDamageTaken +
          battle.playerShip.rockDamage[battle.enemyShip.cannonSize],
      });
    } else {
      setBattle({
        ...battle,
        enemyDamageTaken:
          battle.enemyDamageTaken +
          battle.enemyShip.rockDamage[battle.playerShip.cannonSize],
      });
    }
  };

  const getDamage = (identity) => {
    let damageTaken, maxDamage;

    if (identity === "player") {
      const enemyCannonSize = battle.enemyShip.cannonSize;
      maxDamage = battle.playerShip.maxPillageDamage[enemyCannonSize];
      damageTaken = battle.playerDamageTaken;
    } else {
      const playerCannonSize = battle.playerShip.cannonSize;
      maxDamage = battle.enemyShip.maxPillageDamage[playerCannonSize];
      damageTaken = battle.enemyDamageTaken;
    }

    const damagePercent = (damageTaken / maxDamage) * 100;
    return parseFloat(damagePercent.toFixed(0));
  };

  const getShipDamageStatus = (identity) => {
    let damageTaken, maxPillageDamage;

    if (identity === "player") {
      damageTaken = battle.playerDamageTaken;
      maxPillageDamage =
        battle.playerShip.maxPillageDamage[battle.enemyShip.cannonSize];
    } else {
      damageTaken = battle.enemyDamageTaken;
      maxPillageDamage =
        battle.enemyShip.maxPillageDamage[battle.playerShip.cannonSize];
    }

    const formatNumber = (num) => {
      return num % 1 === 0 ? num.toString() : num.toFixed(1);
    };

    return `${formatNumber(damageTaken)}/${formatNumber(maxPillageDamage)}`;
  };

  const copyScoreToClipboard = async () => {
    const player =
      getShipDamageStatus("player") +
      "(" +
      Math.min(getDamage("player"), 100) +
      "%)";

    const enemy =
      getShipDamageStatus("enemy") +
      "(" +
      Math.min(getDamage("enemy"), 100) +
      "%)";

    const score = player + " - " + enemy;
    try {
      await navigator.clipboard.writeText(score);
    } catch (err) {
      alert("Failed to copy: ");
    }
  };

  const shipsToRender = [
    { identity: "player", ship: battle.playerShip },
    { identity: "enemy", ship: battle.enemyShip },
  ];

  const style = {
    display: "flex",
    flexDirection: "column",
    pt: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: `${
      darkMode
        ? "linear-gradient(to bottom, #0a0f0b, #212121)"
        : "linear-gradient(to bottom, #fafafa, #ffffff)"
    }`,
  };

  return (
    <Box sx={style}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 0.5,
        }}
      >
        <Typography
          textAlign="center"
          variant="h5"
          style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: "bold" }}
        >
          First Mate
        </Typography>
        <BasicMenu
          toggleDarkMode={toggleDarkMode}
          setShowBootyCounter={setShowBootyCounter}
        />
      </Box>
      {showBootyCounter ? (
        <BootyOverview
          setResults={setResults}
          results={results}
          darkMode={darkMode}
        />
      ) : null}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          mb: 1.5,
        }}
      >
        {shipsToRender.map((shipInfo, index) => (
          <ShipCard
            key={index}
            identity={shipInfo.identity}
            ship={shipInfo.ship}
            ships={ships}
            battle={battle}
            handleShipChange={handleShipChange}
            recordShotsTaken={recordShotsTaken}
            getDamage={getDamage}
            recordRockDamage={recordRockDamage}
            getShipDamageStatus={getShipDamageStatus}
            expandShipInfo={expandShipInfo}
            toggleExpandShipInfo={toggleExpandShipInfo}
            battleType={battleType}
            toggleBattleType={toggleBattleType}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Button size="small" variant="outlined" onClick={recordRamDamage}>
          Ram
        </Button>
        <Button size="small" variant="outlined" onClick={copyScoreToClipboard}>
          Copy Score
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setBattle({ ...battle, playerDamageTaken: 0, enemyDamageTaken: 0 });
          }}
        >
          Reset Score
        </Button>
      </Box>

      <BootyManager setResults={setResults} addBattleResult={addBattleResult} />
    </Box>
  );
}
