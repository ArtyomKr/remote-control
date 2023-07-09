import { IWinnerRes } from '../models/index.js';
import { getWinners, saveWinner } from '../dbHelpers/index.js';

function winnerRecordHandler(userId?: number): IWinnerRes {
  const winners = userId !== undefined ? saveWinner(userId) : getWinners();
  return {
    type: 'update_winners',
    data: winners,
    id: 0,
  };
}

export default winnerRecordHandler;
