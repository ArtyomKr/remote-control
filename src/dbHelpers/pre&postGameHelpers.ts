import { getDB, setDB } from '../db/index.js';
import { IGame, IShip, IUser } from '../models/index.js';

function createGame(players: Omit<IUser, 'password'>[]) {
  const db = getDB();
  (<IGame['players']>players).forEach((player) => {
    player.ships = [];
    player.placedShips = [];
    player.turnHistory = [];
  });
  const game = {
    gameId: db.games.length,
    players: <IGame['players']>players,
    userMakingTurn: players[0].index,
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
      ? empty.map((el, i) => ({ x: position.x, y: position.y + i, destroyed: false }))
      : empty.map((el, i) => ({ x: position.x + i, y: position.y, destroyed: false }));

    return { pos, killed: false };
  });
}

function deleteGame(gameIndex: number) {
  const db = getDB();
  db.games = db.games.filter(({ gameId }) => gameId !== gameIndex);

  setDB(db);
}

export { createGame, addShips, deleteGame };
