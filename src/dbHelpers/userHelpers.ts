import { IUser } from '../models/index.js';
import { getDB, setDB } from '../db/index.js';

function addUser(user: IUser) {
  const db = getDB();
  db.users.push(user);
  setDB(db);
  return user;
}

function findUser(userName: string) {
  const db = getDB();
  return db.users.find(({ name }) => name === userName);
}

export { addUser, findUser };
