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
  console.log('DB: ' + JSON.stringify(db.battleship));
  return db.battleship;
}

function getDB(): IDB {
  return JSON.parse(JSON.stringify(db.battleship));
}

export { getDB, setDB };
