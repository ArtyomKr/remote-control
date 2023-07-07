import { IChangeTurnRes } from '../models/index.js';
import { findPlayerGame, getCurrentTurn, passTurn } from '../dbHelpers/index.js';

function turnRes(userId: number): IChangeTurnRes {
  const { userMakingTurn } = findPlayerGame(userId);

  return {
    type: 'turn',
    data: {
      currentPlayer: userMakingTurn,
    },
    id: 0,
  };
}

export default turnRes;
