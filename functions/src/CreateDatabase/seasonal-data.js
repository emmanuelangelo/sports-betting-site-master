// External Imports
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import * as _ from "lodash";

// Internal imports
import { sleep } from "../Utils";

// Base URL for season endpoint
const seasonalURL = `https://www.balldontlie.io/api/v1/season_averages`;

// Initialize database
const db = admin.firestore();

// Create player collection reference
const seasonalAveragesCollectionRef = db.collection("Season Averages");

// Query parameters
const seasons = [
  2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
];

// Initialize player ID array
const playerIDArray = [];

//Populate array
for (let i = 1; i <= 500; i++) {
  playerIDArray.push(i);
}

// Function to make get request for average player stats by season
const getPlayerDataBySeason = async (season) => {
  // Make get request with concatenated url of all player IDs
  const resp = await axios.get(
    seasonalURL +
      `?season=${season}&player_ids[]=` +
      `${playerIDArray.join("&player_ids[]=")}`
  );
  return resp;
};

const seasonalData = async () => {
  console.log("Updating Player Data");
  const allReqs = [];
  // Loops through each season then each player to get player stats for every player on every season
  for (let i = 0; i < seasons.length; i++) {
    const results = await getPlayerDataBySeason(2010 + i);
    // console.log(result.data.data);
    allReqs.push(results.data.data);
  }
  return Promise.all(allReqs);
};

// Batch write function
async function batchWrite(workerFn, batch) {
  const batchObj = batch ? batch : db.batch();
  workerFn(batchObj);
  return await batchObj.commit();
}

async function saveToFirestore(retryCount = 0) {
  // Array I will push all of my batches into
  const batches = [];
  const batchSize = 500;

  try {
    const playerArray = await seasonalData();
    // Flatten player array
    const flattenedPlayerArray = _.flatten(playerArray);

    // Iterate through every player's stats seasonal stats
    for (let i = 0; i < flattenedPlayerArray.length; i += batchSize) {
      if (i % batchSize === 0) console.log(i);
      const playerSlice = flattenedPlayerArray.slice(i, i + batchSize);
      const batchWriter = batchWrite((batch) => {
        for (const player of playerSlice) {
          const newDoc = seasonalAveragesCollectionRef.doc();

          batch.set(newDoc, {
            playerID: player.player_id,
            season: player.season,
            gamesPlayed: player.games_played,
            minsPlayed: player.min,
            points: player.pts,
            assists: player.ast,
            rebounds: player.reb,
            steals: player.stl,
            blocks: player.blk,
            shotPct: player.fg_pct,
            threePointPct: player.fg3_pct,
            freeThrowPct: player.ft_pct,
            shotMade: player.fgm,
            shotAttempt: player.fga,
          });
        }
      });
      batches.push(batchWriter);
    }
    await Promise.all(batches);
    console.log(`Done uploading`);
  } catch (e) {
    if (retryCount <= 5) {
      console.log(`Retrying... With error of ${e}`);
      // Sleep 4 seconds if error occurs for reasons mentioned above the try in this function
      await sleep(10000);
      await saveToFirestore(retryCount++);
    } else {
      throw e;
    }
  }
}

export const readInSeasonalData = functions
  .runWith({ timeoutSeconds: 60, memory: "128MB" })
  .https.onRequest(async (req, res) => {
    await saveToFirestore();
  });
