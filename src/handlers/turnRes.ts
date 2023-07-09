import { IChangeTurnRes, IGame } from '../models/index.js';
import { findPlayerGame } from '../dbHelpers/index.js';

function turnRes(userId: number): IChangeTurnRes {
  const { userMakingTurn } = <IGame>findPlayerGame(userId);

  return {
    type: 'turn',
    data: {
      currentPlayer: userMakingTurn,
    },
    id: 0,
  };
}

export default turnRes;
