import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

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

  useEffect(() => {
    console.log(results);
  }, [results]);

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
      playerVesselPirates,
      enemyVesselPirates,
    } = getLatestBattleResult(chatLogContent, payPerGreedy);

    setResults((prevState) => {
      let updatedPirates = [...prevState.pirates];

      newPirates.forEach((newPirate) => {
        const existingPirateIndex = updatedPirates.findIndex(
          (pirate) => pirate.name === newPirate.name
        );
        if (existingPirateIndex === -1) {
          updatedPirates.push({
            ...newPirate,
            battles: 1,
            krakenShares: 0,
            bootyShareAdjustment: 0,
          });
        } else {
          const existingPirate = updatedPirates[existingPirateIndex];
          updatedPirates[existingPirateIndex] = {
            ...existingPirate,
            greedyHits: existingPirate.greedyHits + newPirate.greedyHits,
            battles: existingPirate.battles + 1,
          };
        }
      });

      const updatedWins = wonBattle ? prevState.wins + 1 : prevState.wins;
      const updatedLosses = !wonBattle
        ? prevState.losses + 1
        : prevState.losses;
      const updatedPOE = prevState.poe + poe;
      const updatedCommodities = prevState.commodities + commodities;
      const updatedLavishLockers = prevState.lavishLockers + lavishLockers;

      const updatedBattles = [
        ...prevState.battles,
        {
          id: uuid(),
          wonBattle,
          poe,
          commodities,
          lavishLockers,
          pirates: newPirates,
          greedyHitPayCommands,
          greedyHitsSummary,
          playerShip: battle.playerShip,
          enemyShip: battle.enemyShip,
          playerDamageTaken: battle.playerDamageTaken,
          enemyDamageTaken: battle.enemyDamageTaken,
          playerVesselPirates,
          enemyVesselPirates,
        },
      ];

      setBattle({ ...battle, playerDamageTaken: 0, enemyDamageTaken: 0 });

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

  const deleteBattle = (battleId) => {
    setResults((prevState) => {
      // Find the battle to be deleted
      const battleToDelete = prevState.battles.find(
        (battle) => battle.id === battleId
      );
      if (!battleToDelete) return prevState; // Battle not found, return current state

      // Adjust the cumulative values based on the deleted battle's outcome
      const updatedWins = battleToDelete.wonBattle
        ? prevState.wins - 1
        : prevState.wins;
      const updatedLosses = !battleToDelete.wonBattle
        ? prevState.losses - 1
        : prevState.losses;

      // Adjust POE, commodities, and lavishLockers based on whether the battle was won or lost
      const updatedPOE = battleToDelete.wonBattle
        ? prevState.poe - battleToDelete.poe
        : prevState.poe + battleToDelete.poe;
      const updatedCommodities = battleToDelete.wonBattle
        ? prevState.commodities - battleToDelete.commodities
        : prevState.commodities + battleToDelete.commodities;
      const updatedLavishLockers = battleToDelete.wonBattle
        ? prevState.lavishLockers - battleToDelete.lavishLockers
        : prevState.lavishLockers + battleToDelete.lavishLockers;

      // Remove the battle from the battles array
      const updatedBattles = prevState.battles.filter(
        (battle) => battle.id !== battleId
      );

      // Return the updated state
      return {
        ...prevState,
        wins: updatedWins,
        losses: updatedLosses,
        poe: updatedPOE,
        commodities: updatedCommodities,
        lavishLockers: updatedLavishLockers,
        battles: updatedBattles,
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

      <BootyManager
        setResults={setResults}
        addBattleResult={addBattleResult}
        results={results}
        deleteBattle={deleteBattle}
      />
    </Box>
  );
}
