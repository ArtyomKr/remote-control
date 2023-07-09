import { IFinishGameRes } from '../models/index.js';

function finishGameHandler(userId: number): IFinishGameRes {
  return {
    type: 'finish',
    data: {
      winPlayer: userId,
    },
    id: 0,
  };
}

export default finishGameHandler;
