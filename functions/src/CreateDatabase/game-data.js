// External Imports
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import * as _ from "lodash";

// Internal Imports
import { sleep } from "../Utils/index.js";

// Url
const gamesURL = "https://www.balldontlie.io/api/v1/games";
// Initialize database
const db = admin.firestore();

// Create player collection reference
const gamesCollectionRef = db.collection("Games");

// Initialize teamID array
const teamIDArray = [];
const seasonArray = [];

//Populate array
for (let i = 1; i <= 30; i++) {
  teamIDArray.push(i);
}
for (let i = 0; i <= 10; i++) {
  seasonArray.push(i + 2010);
}

//Array to push data into
const allReqs = [];

//Array that will take in new value of results on every iteration is used to check value of page number
var lastResults = [];

// Pull in all game data by season and team with axios
const getAllGameStatsByTeam = async (per_page, post_season, page) => {
  //Make request with concatenated url
  const resp = await axios.get(
    gamesURL +
      `?seasons[]=` +
      `${seasonArray.join(`&seasons[]=`)}` +
      `&team_ids[]=` +
      `${teamIDArray.join(`&team_ids[]=`)}` +
      `&per_page=${per_page}&post_season=${post_season}&page=${page}`
  );
  return resp;
};

// Function to write data to firestore with a retry count of 5
const loadInData = async (currentPage, retryCount = 0) => {
  //try and catch to repeat in case server is pinged too frequently or too many writes or made to firestore
  try {
    const results = await getAllGameStatsByTeam(100, 0, currentPage);
    //set results to last results so it can be checked in do while loop for pagination
    lastResults = results;
    const result = results.data.data;
    console.log(
      `page: ${currentPage} current page: ${results.data.meta.current_page}`
    );
    return result;
  } catch (e) {
    if (retryCount <= 5) {
      console.log(
        `Failed on page ${currentPage} with error ${e.name}. Retrying..`
      );
      // Sleep 4 seconds if error occurs for reasons mentioned above the try in this function
      await sleep(10000);
      //repeat attempt of function
      await loadInData(currentPage, retryCount++);
    } else {
      throw e;
    }
  }
};

//Have data pushed into array
const dataArray = async () => {
  // set page value
  let currentPage = 0;
  do {
    const result = await loadInData(currentPage);
    allReqs.push(result);
    currentPage++;
  } while (lastResults.data.meta.next_page !== null);

  return Promise.all(allReqs);
};

// Batch write function
async function batchWrite(workerFn, batch) {
  const batchObj = batch ? batch : db.batch();
  workerFn(batchObj);
  return await batchObj.commit();
}

//Flatten array and push into firestore
const saveToFirestore = async () => {
  //set batchsize to chunk out games
  const batchSize = 500;

  const games = await dataArray();
  const flattenedGameArray = _.flatten(games);
  const filteredFlattenedGameArray = _.filter(flattenedGameArray);
  console.log(`game array length: ${flattenedGameArray.length}`);
  console.log(
    `filtered game array length: ${filteredFlattenedGameArray.length}`
  );
  for (let i = 0; i < filteredFlattenedGameArray.length; i += batchSize) {
    if (i % batchSize === 0) console.log(i);
    const gameSlice = filteredFlattenedGameArray.slice(i, i + batchSize);
    const batchWriter = batchWrite((batch) => {
      for (const game of gameSlice) {
        const newDoc = gamesCollectionRef.doc();

        batch.set(newDoc, {
          season: game.season,
          id: game.id,
          date: game.date,
          homeScore: game.home_team_score,
          visitorScore: game.visitor_team_score,
          homeTeam: game.home_team.full_name,
          homeTeamConference: game.home_team.conference,
          homeTeamDivision: game.home_team.division,
          visitorTeam: game.visitor_team.full_name,
          visitorTeamConference: game.visitor_team.conference,
          visitorTeamDivision: game.visitor_team.division,
        });
      }
    });
    console.log(`It iterated over and got to the batches`);
    await batchWriter;
    await sleep(2000);
  }
  console.log(`Done uploading`);
};

//Firebase function that runs on http request and extends runtime from 60s to 540s
export const gameData = functions
  .runWith({ timeoutSeconds: 250, memory: "1GB" })
  .https.onRequest(async (req, res) => {
    await saveToFirestore();
  });
