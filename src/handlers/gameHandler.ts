import { IAttackReq, IAttackRes } from '../models/index.js';
import { attack, calcSplashWave } from '../dbHelpers/index.js';

function gameHandler(req: IAttackReq): { type: 'attack_multiple'; resArr: IAttackRes[] } | IAttackRes {
  const { gameId, indexPlayer, x, y } = req.data;
  const { target, status } = attack(gameId, indexPlayer, { x, y });
  if (status === 'killed') {
    const splashCoord = calcSplashWave(target);
    //   type: 'attack_multiple',
    //   resArr:
    //
  } else
    return {
      type: 'attack',
      data: {
        position: {
          x,
          y,
        },
        currentPlayer: indexPlayer,
        status: status,
      },
      id: req.id,
    };
}

export default gameHandler;
