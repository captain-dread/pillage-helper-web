function hasBattleStarted(line) {
  const possibleStarts = [
    "You intercepted the",
    "You have been intercepted by the",
  ];
  return possibleStarts.some((start) => line.includes(start));
}

function hasBattleEnded(line) {
  const possibleEnd = "The victors plundered";
  return line.includes(possibleEnd);
}

function getIndividualGreedyHit(line) {
  const pattern =
    /\[\d{2}:\d{2}:\d{2}\]\s(.*?)\s(swing|perform|execute|deliver)s a/;
  const match = line.match(pattern);
  return match ? match[1] : null;
}

function wasBattleWon(inputString) {
  const winnersPart = inputString.split("Winners: ")[1];
  const names = winnersPart.split(",").map((name) => name.trim());

  for (let name of names) {
    if (!name.includes(" ")) {
      return true;
    }
  }

  return false;
}

function extractPlunderedGoods(inputString) {
  const stringWithoutTimestamp = inputString.replace(
    /\[\d{2}:\d{2}:\d{2}\]\s*/,
    ""
  );
  const numberPattern = /[\d,]+/g;

  const numberStrings = stringWithoutTimestamp.match(numberPattern);

  if (numberStrings && numberStrings.length >= 2) {
    return {
      piecesOfEight: parseInt(numberStrings[0].replace(/,/g, ""), 10),
      unitsOfGoods: parseInt(numberStrings[1].replace(/,/g, ""), 10),
    };
  } else {
    return {
      piecesOfEight: 0,
      unitsOfGoods: 0,
    };
  }
}

function greedyHitStringSummary(battleResult) {
  const { pirates, totalHits } = battleResult;
  pirates.sort((a, b) => b.greedyHits - a.greedyHits);

  let resultString = `${totalHits} total hits!`;
  for (const pirate of pirates) {
    const { name, greedyHits } = pirate;
    if (greedyHits > 0) {
      resultString += ` ${name}: ${greedyHits},`;
    }
  }
  resultString = resultString.slice(0, -1);
  return resultString;
}

function pullGreedyHitsFromBattleLog(latestBattle, pirates) {
  const updatedPirates = [...pirates];

  let totalHits = 0;
  latestBattle.forEach((line) => {
    const nameOfPirateWhoHit = getIndividualGreedyHit(line);
    if (nameOfPirateWhoHit) {
      let pirate = updatedPirates.find(
        (obj) => obj.name === nameOfPirateWhoHit
      );
      if (pirate) {
        pirate.greedyHits += 1;
        totalHits += 1;
      }
    }
  });

  return {
    pirates: updatedPirates,
    totalHits,
  };
}

function getParticipatingPirates(latestBattle, didWinLastBattle) {
  const playerVesselPirates = [];
  const enemyVesselPirates = [];
  const realPirates = [];

  if (didWinLastBattle) {
    latestBattle.forEach((line) => {
      if (line.includes("Game over.  Winners:")) {
        const winnersPart = line.split("Winners: ")[1];
        const names = winnersPart.split(",").map((name) => name.trim());
        for (let name of names) {
          playerVesselPirates.push(name);
          if (!name.includes(" ")) {
            realPirates.push({ name: name, greedyHits: 0 });
          }
        }
      }
    });
  } else {
    // Process for when the player's team loses
    latestBattle.forEach((line) => {
      if (line.includes("Game over.  Winners:")) {
        const winnersPart = line.split("Winners: ")[1];
        const names = winnersPart.split(",").map((name) => name.trim());
        for (let name of names) {
          enemyVesselPirates.push(name);
        }
      }
    });
  }

  // This part is common for both winning and losing scenarios
  latestBattle.forEach((line) => {
    const stringWithoutTimestamp = line.replace(/\[\d{2}:\d{2}:\d{2}\]\s*/, "");
    const eliminationPattern = /(.+) is eliminated!/;
    const match = stringWithoutTimestamp.match(eliminationPattern);

    if (match) {
      const pirateName = match[1];
      if (didWinLastBattle) {
        // Original logic for winning scenario
        if (!playerVesselPirates.includes(pirateName)) {
          if (!enemyVesselPirates.includes(pirateName)) {
            enemyVesselPirates.push(pirateName);
          }
        }
      } else {
        // Reverse logic for losing scenario
        if (!enemyVesselPirates.includes(pirateName)) {
          playerVesselPirates.push(pirateName);
          if (!pirateName.includes(" ")) {
            realPirates.push({ name: pirateName, greedyHits: 0 });
          }
        }
      }
    }
  });

  return { realPirates, playerVesselPirates, enemyVesselPirates };
}

function getBootyResults(latestBattle) {
  const res = {
    win: false,
    poe: 0,
    commodities: 0,
  };

  latestBattle.forEach((line) => {
    if (line.includes("Game over.  Winners:")) {
      let didWin = wasBattleWon(line);
      res.win = didWin;
    }

    if (line.includes("The victors plundered")) {
      const { piecesOfEight, unitsOfGoods } = extractPlunderedGoods(line);
      res.poe = piecesOfEight;
      res.commodities = unitsOfGoods;
    }
  });

  const pirateParticipation = getParticipatingPirates(latestBattle, res.win);
  res.pirates = pirateParticipation.realPirates;
  res.playerVesselPirates = pirateParticipation.playerVesselPirates;
  res.enemyVesselPirates = pirateParticipation.enemyVesselPirates;

  return res;
}

function getLogsFromLatestBattle(logContent) {
  const latestBattle = [];
  let recordingBattle = false;
  const lines = logContent.split("\n");

  lines.forEach((line) => {
    if (recordingBattle) {
      latestBattle.push(line.trim());
    }
    if (hasBattleStarted(line)) {
      latestBattle.length = 0;
      recordingBattle = true;
    } else if (hasBattleEnded(line)) {
      recordingBattle = false;
    }
  });

  return latestBattle;
}

export function getLatestBattleResult(logContent, pay) {
  try {
    const latestBattle = getLogsFromLatestBattle(logContent);
    const bootyResults = getBootyResults(latestBattle);
    const greedyResults = pullGreedyHitsFromBattleLog(
      latestBattle,
      bootyResults.pirates
    );

    const greedyHitPayCommands = [];
    for (const pirate of greedyResults.pirates) {
      const { name, greedyHits } = pirate;
      if (greedyHits > 0) {
        greedyHitPayCommands.push(`/pay ${name} ${greedyHits * pay}`);
      }
    }

    return {
      greedyHitsSummary: greedyHitStringSummary(greedyResults),
      greedyHitPayCommands,
      wonBattle: bootyResults.win,
      poe: bootyResults.poe,
      commodities: bootyResults.commodities,
      lavishLockers: greedyResults.totalHits,
      pirates: greedyResults.pirates,
      playerVesselPirates: bootyResults.playerVesselPirates.length,
      enemyVesselPirates: bootyResults.enemyVesselPirates.length,
      battleLog: latestBattle,
    };
  } catch (e) {
    console.error("Error processing log content: ", e);
  }
}
