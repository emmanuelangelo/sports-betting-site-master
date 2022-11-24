// External Imports
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// Initialize firebase app
admin.initializeApp();

// Export pubsub scheduled function to load in game data
export { gameData } from "./CreateDatabase/game-data";

//Export function to write player data to firestore
export { playerData } from "./CreateDatabase/player-data";

// Export function to load in seasonal average player stats
export { readInSeasonalData } from "./CreateDatabase/seasonal-data";
