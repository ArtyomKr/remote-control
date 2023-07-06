import { IDB, IDBWrapped } from '../models/index.js';

const db: IDBWrapped = {
  battleship: {
    users: [],
    rooms: [],
    games: [],
  },
};

function setDB(newDb: IDB) {
  db.battleship = newDb;
  return db.battleship;
}

function getDB(): IDB {
  return JSON.parse(JSON.stringify(db.battleship));
}

export { getDB, setDB };
