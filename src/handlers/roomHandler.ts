import { IAddPlayerReq, ICreateGameRes, ICreateRoomReq, IUpdateRoomRes } from '../models/index.js';
import { addPlayerToRoom, createRoom } from '../dbHelpers/index.js';

function roomHandler(req: ICreateRoomReq | IAddPlayerReq): IUpdateRoomRes | ICreateGameRes | undefined {
  if (req.type === 'create_room') {
    const { roomId, roomUsers } = createRoom(req.id);
    return {
      type: 'create_game',
      data: {
        idGame: roomId,
        idPlayer: roomUsers[0].index,
      },
      id: 0,
    };
  }
  if (req.type === 'add_player_to_room') {
    const { indexRoom } = req.data;
    const rooms = addPlayerToRoom(indexRoom, req.id)
    return {
      type: "update_room",
      data: rooms,
      id: 0,
    }
  }
}

export default roomHandler;
