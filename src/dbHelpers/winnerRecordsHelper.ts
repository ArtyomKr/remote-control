import { getDB, setDB } from '../db/index.js';
import { findUserById } from './userHelpers.js';
import { IUser } from '../models/index.js';

function saveWinner(userId: number) {
  const db = getDB();
  const { name: winnerName } = <IUser>findUserById(userId);
  const prevRecord = db.winners.find(({ name }) => name === winnerName);
  if (prevRecord) prevRecord.wins++;
  else db.winners.push({ name: winnerName, wins: 1 });
  setDB(db);
  return db.winners;
}

function getWinners() {
  return getDB().winners;
}

export { saveWinner, getWinners };
