import { IAttackReq, IAttackRes } from '../models/index.js';
import { attack } from '../dbHelpers/index.js';

function gameHandler(req: IAttackReq): IAttackRes {
  const { gameId, indexPlayer, x, y } = req.data;
  return {
    type: 'attack',
    data: {
      position: {
        x,
        y,
      },
      currentPlayer: indexPlayer,
      status: attack(gameId, indexPlayer, { x, y }),
    },
    id: req.id,
  };
}

export default gameHandler;
