import { getDB } from '../db/index.js';
import { IUpdateRoomRes } from '../models/index.js';

function updateRoomsRes(): IUpdateRoomRes {
  return {
    type: 'update_room',
    data: getDB().rooms,
    id: 0,
  };
}

export default updateRoomsRes;
