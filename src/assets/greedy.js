// Function to check if a battle has started based on predefined patterns
function hasBattleStarted(line) {
  const possibleStarts = [
    "You intercepted the",
    "You have been intercepted by the",
  ];
  return possibleStarts.some((start) => line.includes(start));
}

// Function to check if a battle has ended based on a predefined pattern
function hasBattleEnded(line) {
  const possibleEnd = "The victors plundered";
  return line.includes(possibleEnd);
}

// Function to extract the name of individual who made a greedy hit using regex pattern (if none, return nothing)
function getIndividualGreedyHit(line) {
  const pattern =
    /\[\d{2}:\d{2}:\d{2}\]\s(.*?)\s(swing|perform|execute|deliver)s a/;
  const match = line.match(pattern);
  return match ? match[1] : null;
}

function hasSingleWordName(inputString) {
  const winnersPart = inputString.split("Winners: ")[1];
  const names = winnersPart.split(",").map((name) => name.trim());

  for (let name of names) {
    if (!name.includes(" ")) {
      return true; // Found a single word name
    }
  }

  return false; // No single word names found
}

function extractNumbers(inputString) {
  // Remove the timestamp from the string
  const stringWithoutTimestamp = inputString.replace(
    /\[\d{2}:\d{2}:\d{2}\]\s*/,
    ""
  );

  // Regular expression to find numbers (including commas) in the modified string
  const numberPattern = /[\d,]+/g;

  // Extract all numbers (as strings) found in the modified string
  const numberStrings = stringWithoutTimestamp.match(numberPattern);

  // Convert the number strings to integers, removing commas
  if (numberStrings && numberStrings.length >= 2) {
    return {
      piecesOfEight: parseInt(numberStrings[0].replace(/,/g, ""), 10),
      unitsOfGoods: parseInt(numberStrings[1].replace(/,/g, ""), 10),
    };
  }

  return null; // In case the pattern is not matched or there aren't enough numbers
}

// Function to count greedy hits from battle logs
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

function formatBattleResult(battleResult) {
  const { hits, totalHits } = battleResult;

  let resultString = `${totalHits} total hits!`;

  const sortedHits = Object.entries(hits).sort((a, b) => b[1] - a[1]);

  for (const [name, hitCount] of sortedHits) {
    resultString += ` ${name}: ${hitCount},`;
  }

  resultString = resultString.slice(0, -1);

  return resultString;
}

function getBootyResults(latestBattle) {
  const res = {
    win: false,
    poe: 0,
    commodities: 0,
  };

  latestBattle.forEach((line) => {
    if (line.includes("Game over.  Winners:")) {
      let didWin = hasSingleWordName(line);
      res.win = didWin;
    }

    if (line.includes("The victors plundered")) {
      const { piecesOfEight, unitsOfGoods } = extractNumbers(line);
      res.poe = piecesOfEight;
      res.commodities = unitsOfGoods;
    }
  });

  return res;
}

export function processLogContent(logContent, pay) {
  try {
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

    const bootyResults = getBootyResults(latestBattle);
    const battleResult = pullGreedyHitsFromBattleLog(latestBattle);

    const payCommands = [];
    for (const [name, hitCount] of Object.entries(battleResult.hits)) {
      payCommands.push(`/pay ${name} ${hitCount * pay}`);
    }

    return {
      result: formatBattleResult(battleResult),
      payCommands,
      totalHits: battleResult.totalHits,
      wonBattle: bootyResults.win,
      poe: bootyResults.poe,
      commodities: bootyResults.commodities,
    };
  } catch (e) {
    console.error("Error processing log content: ", e);
  }
}
