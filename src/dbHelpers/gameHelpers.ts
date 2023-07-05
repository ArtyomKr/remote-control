import { getDB, setDB } from '../db/index.js';
import { IGame, IUser } from '../models/index.js';

function createGame(players: Omit<IUser, 'password'>[]) {
  const db = getDB();
  (<IGame['players']>players).forEach((player) => player.ships = []);
  const game = {
    gameId: db.games.length,
    players: (<IGame['players']>players)
  }
  db.games.push(game);
  setDB(db);

  return game;
}

export { createGame };