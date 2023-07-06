import { getDB, setDB } from '../db/index.js';
import { IGame, IShip, IUser } from '../models/index.js';

function createGame(players: Omit<IUser, 'password'>[]) {
  const db = getDB();
  (<IGame['players']>players).forEach((player) => {
    player.ships = [];
    player.placedShips = [];
  });
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
  game?.players.forEach((player) => {
    if (player.index === playerId) {
      player.ships = shipsArr;
      player.placedShips = placeShips(shipsArr);
    }
  });

  setDB(db);
  return game;
}

function placeShips(ships: IShip[]) {
  return ships.map(({ direction, position, length }) => {
    const empty = new Array(length).fill(null);
    const pos = direction
      ? empty.map((el, i) => ({ x: position.x, y: position.y + i }))
      : empty.map((el, i) => ({ x: position.x + i, y: position.y }));

    return { pos, killed: false };
  });
}

export { createGame, addShips };
