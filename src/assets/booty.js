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
  }

  return null;
}

function greedyHitStringSummary(battleResult) {
  const { hits, totalHits } = battleResult;

  let resultString = `${totalHits} total hits!`;

  const sortedHits = Object.entries(hits).sort((a, b) => b[1] - a[1]);

  for (const [name, hitCount] of sortedHits) {
    resultString += ` ${name}: ${hitCount},`;
  }

  resultString = resultString.slice(0, -1);

  return resultString;
}

function pullGreedyHitsFromBattleLog(latestBattle) {
  const hits = {};
  let totalHits = 0;

  latestBattle.forEach((line) => {
    const name = getIndividualGreedyHit(line);
    if (name) {
      if (!hits[name]) {
        hits[name] = 0;
      }
      hits[name] += 1;
      totalHits += 1;
    }
  });

  return { hits, totalHits };
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

    // Contains Poe, Commodities, Win/Loss
    const bootyResults = getBootyResults(latestBattle);

    // Contains {pirate: numHits, totalHits}
    const greedyResults = pullGreedyHitsFromBattleLog(latestBattle);

    const greedyHitPayCommands = [];
    for (const [name, hitCount] of Object.entries(greedyResults.hits)) {
      greedyHitPayCommands.push(`/pay ${name} ${hitCount * pay}`);
    }

    return {
      greedyHitsSummary: greedyHitStringSummary(greedyResults),
      greedyHitPayCommands,
      wonBattle: bootyResults.win,
      poe: bootyResults.poe,
      commodities: bootyResults.commodities,
      lavishLockers: greedyResults.totalHits,
    };
  } catch (e) {
    console.error("Error processing log content: ", e);
  }
}
