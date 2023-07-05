import { getDB, setDB } from '../db/index.js';
import { IRoom, IUser } from '../models/modelsDB.js';
import { findUserById } from './userHelpers.js';

function createRoom() {
  const db = getDB();
  const newRoom = { roomId: db.rooms.length, roomUsers: [] };

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

export { createRoom, addPlayerToRoom, deleteRoom };
