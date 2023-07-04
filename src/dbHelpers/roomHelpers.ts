import { getDB, setDB } from '../db/index.js';

function createRoom() {
  const db = getDB();
  const newRoom = { roomId: db.rooms.length, roomUsers: [] };

  db.rooms.push(newRoom);
  setDB(db);
  return newRoom;
}

function addPlayerToRoom(roomIndex: number) {
  const db = getDB();
  const room = db.rooms.find(({ roomId }) => roomId === roomIndex);

  if (!room) return null;
  room.roomUsers.push();
  setDB(db);
}

export { createRoom };
