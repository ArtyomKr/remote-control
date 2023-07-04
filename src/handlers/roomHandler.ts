import { IAddPlayerReq, ICreateGameRes, ICreateRoomReq, IUpdateRoomRes } from '../models/index.js';
import { createRoom } from '../dbHelpers/index.js';

function roomHandler(req: ICreateRoomReq | IAddPlayerReq): IUpdateRoomRes | ICreateGameRes | undefined {
  if (req.type === 'create_room') {
    const { roomId, roomUsers } = createRoom();
    return {
      type: 'create_game',
      data: {
        idGame: roomId,
        idPlayer: 0,
      },
      id: 0,
    };
  }
}

export default roomHandler;
