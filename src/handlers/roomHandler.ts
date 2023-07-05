import { IAddPlayerReq, ICreateGameRes, ICreateRoomReq, IUpdateRoomRes } from '../models/index.js';
import { addPlayerToRoom, createRoom, createGame, deleteRoom } from '../dbHelpers/index.js';
import updateRoomsRes from './updateRooms.js';

function roomHandler(req: ICreateRoomReq | IAddPlayerReq): IUpdateRoomRes | ICreateGameRes {
  if (req.type === 'create_room') {
    createRoom();
  }
  if (req.type === 'add_user_to_room') {
    const { indexRoom } = req.data;
    const room = addPlayerToRoom(indexRoom, req.id);
    if (room.roomUsers.length >= 2) {
      deleteRoom(indexRoom);
      const game = createGame(room.roomUsers);
      return {
        type: 'create_game',
        data: {
          idGame: game.gameId,
          idPlayer: req.id === game.players[0].index ? game.players[1].index : game.players[0].index,
        },
        id: req.id,
      };
    }
  }
  return updateRoomsRes();
}

export default roomHandler;
