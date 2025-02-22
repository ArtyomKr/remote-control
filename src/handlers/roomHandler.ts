import { IAddPlayerReq, ICreateGameRes, ICreateRoomReq, IUpdateRoomRes } from '../models/index.js';
import { addPlayerToRoom, createRoom, createGame, deleteRoom, findPlayerRoom } from '../dbHelpers/index.js';
import updateRoomsRes from './updateRooms.js';

function roomHandler(
  req: ICreateRoomReq | IAddPlayerReq,
): { type: 'create_game'; resArr: ICreateGameRes[] } | IUpdateRoomRes {
  const userId = req.id;
  if (req.type === 'create_room' && !findPlayerRoom(userId)) {
    createRoom(userId);
  }
  if (req.type === 'add_user_to_room' && !findPlayerRoom(userId)) {
    const { indexRoom } = req.data;
    const room = addPlayerToRoom(indexRoom, userId);
    if (room.roomUsers.length >= 2) {
      const game = createGame(room.roomUsers);
      deleteRoom(indexRoom);
      const resArr = game.players.map(
        ({ index }): ICreateGameRes => ({
          type: 'create_game',
          data: {
            idGame: game.gameId,
            idPlayer: index,
          },
          id: 0,
        }),
      );
      return {
        type: 'create_game',
        resArr,
      };
    }
  }
  return updateRoomsRes();
}

export default roomHandler;
