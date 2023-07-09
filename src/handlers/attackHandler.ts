import { IAttackReq, IAttackRes, IRandomAttackReq } from '../models/index.js';
import { attack, calcSplashWave, generateRandomPos } from '../dbHelpers/index.js';

function attackHandler(req: IAttackReq | IRandomAttackReq): { type: 'attack'; resArr: IAttackRes[] } {
  if (!('x' in req.data)) {
    const randomPos = generateRandomPos(req.data.indexPlayer);
    (<IAttackReq['data']>req.data).x = randomPos.x;
    (<IAttackReq['data']>req.data).y = randomPos.y;
  }
  const attackArr = createAttackArr(<IAttackReq['data']>req.data);

  const resArr = attackArr.map(
    ({ tile, status }): IAttackRes => ({
      type: 'attack',
      data: {
        position: {
          x: tile.x,
          y: tile.y,
        },
        currentPlayer: req.data.indexPlayer,
        status: status,
      },
      id: 0,
    }),
  );

  return {
    type: 'attack',
    resArr,
  };
}

function createAttackArr(
  data: IAttackReq['data'],
): { tile: { x: number; y: number }; status: 'miss' | 'killed' | 'shot' }[] {
  const { gameId, indexPlayer, x, y } = data;
  const { target, status } = attack(gameId, indexPlayer, { x, y });
  const regularAttack = [{ tile: { x, y }, status }];

  if (status === 'killed' && target) {
    const splashCoord = calcSplashWave(target);
    const splashAttacks = splashCoord.map(({ x, y }) => {
      const { status } = attack(gameId, indexPlayer, { x, y });
      return { tile: { x, y }, status };
    });

    return regularAttack.concat(splashAttacks);
  } else return regularAttack;
}

export default attackHandler;
