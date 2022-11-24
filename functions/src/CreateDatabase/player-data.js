// External Imports
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import * as _ from "lodash";

// Internal imports
import { sleep } from "../Utils";

// Url
const playersURL = `https://www.balldontlie.io/api/v1/players`;

// Initialize database
const db = admin.firestore();

// Create player collection reference
const playersCollectionRef = db.collection("Players");

//Array that will take in new value of results on every iteration is used to check value of page number
var lastResults = [];

//all player data pushed into this array and resolved all at once
const allPlayers = [];

//Pull in player specific data i.e. weight, height, name
const getPlayerData = async (per_page, page) => {
  const resp = await axios.get(
    playersURL + `?per_page=${per_page}&page=${page}`
  );

  return resp;
};

const loadInData = async (currentPage, retryCount = 0) => {
  try {
    const results = await getPlayerData(100, currentPage);
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
        `Failed on page ${currentPage} with error ${e.name}. Retrying...`
      );
      // Sleep 4 seconds if error occurs for reasons mentioned above the try in this function
      await sleep(4000);
      //Rerun function
      await loadInData(currentPage, retryCount++);
    } else {
      throw e;
    }
  }
};

//Have data pushed into array
const dataArray = async () => {
  //set current page value
  let currentPage = 0;
  do {
    const result = await loadInData(currentPage);
    allPlayers.push(result);
    currentPage++;
  } while (lastResults.data.meta.next_page !== null);

  return Promise.all(allPlayers);
};

// Batch write function
async function batchWrite(workerFn, batch) {
  const batchObj = batch ? batch : db.batch();
  workerFn(batchObj);
  return await batchObj.commit();
}

const saveToFirestore = async (currentPage, retryCount = 0) => {
  //set batchsize to chunk out players
  const batchSize = 500;

  //recieve player array
  const players = await dataArray(100, currentPage);
  // flatten player array then filter it of any null games so
  // firestore can receive them
  const flattenedPlayerArray = _.flatten(players);
  const filteredFlattenedPlayerArray = _.filter(flattenedPlayerArray);
  console.log(`player array length: ${flattenedPlayerArray.length}`);
  console.log(
    `filtered player array length: ${filteredFlattenedPlayerArray.length}`
  );

  //iterate through player array by 500
  for (let i = 0; i < filteredFlattenedPlayerArray.length; i += batchSize) {
    if (i % batchSize === 0) console.log(i);
    const playerSlice = filteredFlattenedPlayerArray.slice(i, i + batchSize);
    // set batch by 500 then commit using batchwrite function
    const batchWriter = batchWrite((batch) => {
      for (const player of playerSlice) {
        const newDoc = playersCollectionRef.doc();

        // set batch here
        batch.set(newDoc, {
          id: player.id,
          name: player.first_name + player.last_name,
          position: player.position,
          height: `${player.height_feet}'${player.height_inches}`,
          team: player.team.full_name,
        });
      }
    });
    console.log(`It iterated over and got to the batches`);
    await batchWriter;
    await sleep(2000);
  }
};

export const playerData = functions
  .runWith({ timeoutSeconds: 300, memory: "1GB" })
  .https.onRequest(async (req, res) => {
    await saveToFirestore();
    console.log(`Done uploading`);
  });
