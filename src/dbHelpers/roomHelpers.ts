import { getDB, setDB } from '../db/index.js';
import { IRoom, IUser } from '../models/modelsDB.js';
import { findUserById } from './userHelpers.js';

function createRoom(userId: number) {
  const db = getDB();
  const { name, index } = <IUser>findUserById(userId);
  const newRoom = { roomId: db.rooms.length, roomUsers: [{ name, index }] };

  db.rooms.push(newRoom);
  setDB(db);
  return newRoom;
}

function addPlayerToRoom(roomIndex: number, userId: number) {
  const db = getDB();
  const { name, index } = <IUser>findUserById(userId);
  const room = <IRoom>db.rooms.find(({ roomId }) => roomId === roomIndex);

  room.roomUsers.push({ name, index });
  setDB(db);
  return room;
}

function deleteRoom(roomIndex: number) {
  const db = getDB();
  db.rooms = db.rooms.filter(({ roomId }) => roomId !== roomIndex);

  setDB(db);
}

function findPlayerRoom(userId: number): IRoom | undefined {
  const db = getDB();
  return db.rooms.find(({ roomUsers }) => roomUsers.some(({ index }) => index === userId));
}

export { createRoom, addPlayerToRoom, deleteRoom, findPlayerRoom };
