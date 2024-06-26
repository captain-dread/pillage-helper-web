import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { Box, Typography, Button } from "@mui/material";
import ShipCard from "./ShipCard.jsx";
import BootyOverview from "./BootyOverview.jsx";
import BasicMenu from "./atoms/BasicMenu.jsx";
import BootyManager from "./BootyManager.jsx";

import { ships } from "../assets/ships.js";
import { getLatestBattleResult } from "../assets/booty";

import sampleData from "../assets/sampleData.json";

const defaultResults = {
  poe: 0,
  commodities: 0,
  lavishLockers: 0,
  krakenBloods: 0,
  wins: 0,
  losses: 0,
  pirates: [],
  battles: [],
  copyScoreConfig: {
    showPercentage: true,
    showAsFraction: true,
    reverseOrder: false,
  },
};

export default function Home({ toggleDarkMode, darkMode }) {
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem("myResults");
    return savedResults ? JSON.parse(savedResults) : defaultResults;
  });

  useEffect(() => {
    localStorage.setItem("myResults", JSON.stringify(results));
  }, [results]);

  const [battle, setBattle] = useState({
    playerShip: ships[0],
    enemyShip: ships[0],
    playerDamageTaken: 0,
    enemyDamageTaken: 0,
  });

  const [battleType, setBattleType] = useState("brigands");
  const [expandShipInfo, setExpandShipInfo] = useState(false);

  const resetResults = () => {
    setResults(defaultResults);
  };

  const loadSampleData = () => {
    setResults(sampleData);
  };

  const updateCopyScoreConfig = (newConfig) => {
    setResults((currentResults) => ({
      ...currentResults,
      copyScoreConfig: {
        ...currentResults.copyScoreConfig,
        ...newConfig,
      },
    }));
  };

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
      battleLog,
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
          battleType,
          battleLog,
          krakenBloods: 0,
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

    return { greedyHitsSummary, greedyHitPayCommands };
  };

  const updateKrakenShareToBattle = (battleId, operation) => {
    const updatedBattles = results.battles.map((battle) => {
      if (battle.id === battleId) {
        return {
          ...battle,
          krakenBloods:
            operation === "add"
              ? battle.krakenBloods + 1
              : battle.krakenBloods - 1,
        };
      } else {
        return battle;
      }
    });
    const updatedOverallKrakenBloods =
      operation === "add" ? results.krakenBloods + 1 : results.krakenBloods - 1;

    const piratesAggregator = {};
    updatedBattles.forEach((battle) => {
      battle.pirates.forEach((pirate) => {
        const { name, greedyHits } = pirate;

        if (!piratesAggregator[name]) {
          piratesAggregator[name] = {
            name,
            greedyHits,
            battles: 1,
            krakenShares: battle.krakenBloods,
            bootyShareAdjustment: 0,
          };
        } else {
          piratesAggregator[name].greedyHits += greedyHits;
          piratesAggregator[name].battles += 1;
          piratesAggregator[name].krakenShares += battle.krakenBloods;
        }
      });
    });
    const updatedPirates = Object.values(piratesAggregator);

    setResults((prevState) => {
      return {
        ...prevState,
        krakenBloods: updatedOverallKrakenBloods,
        battles: updatedBattles,
        pirates: updatedPirates,
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

      // Initialize an empty object to hold the aggregated data for pirates
      const piratesAggregator = {};

      // Rebuild the pirates list based on the updated list of battles
      updatedBattles.forEach((battle) => {
        battle.pirates.forEach((pirate) => {
          const { name, greedyHits } = pirate;

          if (!piratesAggregator[name]) {
            piratesAggregator[name] = {
              name,
              greedyHits,
              battles: 1,
              krakenShares: 0,
              bootyShareAdjustment: 0,
            };
          } else {
            piratesAggregator[name].greedyHits += greedyHits;
            piratesAggregator[name].battles += 1;
          }
        });
      });

      // Convert the piratesAggregator object back into an array of pirate objects
      const updatedPirates = Object.values(piratesAggregator);

      // Return the updated state
      return {
        ...prevState,
        wins: updatedWins,
        losses: updatedLosses,
        poe: updatedPOE,
        commodities: updatedCommodities,
        lavishLockers: updatedLavishLockers,
        battles: updatedBattles,
        pirates: updatedPirates,
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

  const recordShotsTaken = (identity, shots, undo = false) => {
    setBattle((prevBattle) => {
      const damageKey =
        identity === "player" ? "playerDamageTaken" : "enemyDamageTaken";
      let updatedDamage = prevBattle[damageKey];

      if (undo) {
        // Subtract the shots ensuring it doesn't go below zero
        updatedDamage = Math.max(0, updatedDamage - shots);
      } else {
        // Add the shots to the current damage
        updatedDamage += shots;
      }

      return {
        ...prevBattle,
        [damageKey]: updatedDamage,
      };
    });
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

  const recordRockDamage = (identity, undo = false) => {
    setBattle((prevBattle) => {
      if (identity === "player") {
        const damageAmount =
          prevBattle.playerShip.rockDamage[prevBattle.enemyShip.cannonSize];
        const updatedDamage = undo
          ? Math.max(0, prevBattle.playerDamageTaken - damageAmount)
          : prevBattle.playerDamageTaken + damageAmount;

        return {
          ...prevBattle,
          playerDamageTaken: updatedDamage,
        };
      } else {
        const damageAmount =
          prevBattle.enemyShip.rockDamage[prevBattle.playerShip.cannonSize];
        const updatedDamage = undo
          ? Math.max(0, prevBattle.enemyDamageTaken - damageAmount)
          : prevBattle.enemyDamageTaken + damageAmount;

        return {
          ...prevBattle,
          enemyDamageTaken: updatedDamage,
        };
      }
    });
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

  const getShipDamageStatus = (identity, showAsFraction = true) => {
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

    if (showAsFraction) {
      return `${formatNumber(damageTaken)}/${formatNumber(maxPillageDamage)}`;
    } else {
      return formatNumber(damageTaken);
    }
  };

  const copyScoreToClipboard = async () => {
    const { showPercentage, showAsFraction, reverseOrder } =
      results.copyScoreConfig;

    const formatWithPercentage = (identity, showPercentage) => {
      const baseScore = getShipDamageStatus(identity, showAsFraction);
      const percentage = Math.min(getDamage(identity), 100) + "%";
      return showPercentage ? `${baseScore}(${percentage})` : baseScore;
    };

    const player = formatWithPercentage("player", showPercentage);
    const enemy = formatWithPercentage("enemy", showPercentage);

    const score = reverseOrder
      ? `${enemy} - ${player}`
      : `${player} - ${enemy}`;

    try {
      await navigator.clipboard.writeText(score);
    } catch (err) {
      alert("Failed to copy: " + err.message);
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
        ? "linear-gradient(to bottom, #332922, #121212)" // Subtle dark gold to almost black
        : "linear-gradient(to bottom right, #fafafa, #d7e1ec, #ffffff)" // Light mode remains the same
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
          position: "relative",
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
          resetResults={resetResults}
          setResults={setResults}
          updateCopyScoreConfig={updateCopyScoreConfig}
          results={results}
          loadSampleData={loadSampleData}
        />
        <img
          style={{ position: "absolute", top: 7, left: -19 }}
          src="images/monkey_almond.png"
          width={20}
          height={20}
        />
      </Box>
      <BootyOverview
        setResults={setResults}
        results={results}
        darkMode={darkMode}
      />
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
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
          mb: 1.2,
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
        updateKrakenShareToBattle={updateKrakenShareToBattle}
      />
    </Box>
  );
}
