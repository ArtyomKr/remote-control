import { IUser } from '../models/index.js';
import { getDB, setDB } from '../db/index.js';

function addUser(user: IUser) {
  const db = getDB();
  db.users.push(user);
  setDB(db);
  return user;
}

function findUserByName(userName: string) {
  const db = getDB();
  return db.users.find(({ name }) => name === userName);
}

function findUserById(userId: number) {
  const db = getDB();
  return db.users.find(({ index }) => index === userId);
}

export { addUser, findUserByName, findUserById };
