import { getDB, setDB } from '../db/index.js';
import { IGame, IShip, IUser } from '../models/index.js';

function createGame(players: Omit<IUser, 'password'>[]) {
  const db = getDB();
  (<IGame['players']>players).forEach((player) => (player.ships = []));
  const game = {
    gameId: db.games.length,
    players: <IGame['players']>players,
  };
  db.games.push(game);
  setDB(db);

  return game;
}

function addShips(playerId: number, gameId: number, shipsArr: IShip[]) {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  game?.players.map((player) => { 
    if (player.index === playerId) player.ships = shipsArr;
    return player;
  });

  setDB(db);
  return game;
}

export { createGame, addShips };
