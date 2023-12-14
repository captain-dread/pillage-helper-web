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

  let resultString = `${totalHits} Total Hits!`;
  for (const [name, hitCount] of Object.entries(hits)) {
    resultString += ` ${name}: ${hitCount},`;
  }

  resultString = resultString.slice(0, -1);

  return resultString;
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

    const battleResult = pullGreedyHitsFromBattleLog(latestBattle);

    const payCommands = [];
    for (const [name, hitCount] of Object.entries(battleResult.hits)) {
      payCommands.push(`/pay ${name} ${hitCount * pay}`);
    }

    return { result: formatBattleResult(battleResult), payCommands };
  } catch (e) {
    console.error("Error processing log content: ", e);
  }
}
