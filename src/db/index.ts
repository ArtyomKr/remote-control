import { IDB } from '../models';

const db: IDB = {
  users: [],
  rooms: [],
  games: [],
};

function setDB(newDb: IDB) {
  for (const key in db) {
    db[key] = newDb[key];
  }
  return db;
}

function getDB(): IDB {
  return JSON.parse(JSON.stringify(db));
}

export { getDB, setDB };
