import { addShips } from "../dbHelpers/index.js";
import { IAddShipsReq, IStartGameRes } from "../models/index.js";

function preGameHandler(req: IAddShipsReq) : { type: 'start_game', resArr: IStartGameRes[]} | undefined {
  const { indexPlayer, gameId, ships } = req.data;
  const game = addShips(indexPlayer, gameId, ships);
  const readyPlayers = game?.players.filter(({ ships }) => ships.length > 0)?? []
  if (readyPlayers.length === game?.players.length) {
    const resArr = readyPlayers.map(({ index, ships }): IStartGameRes => ({
      type: 'start_game',
      data: {
        ships: ships,
        currentPlayerIndex: index,
      },
      id: index
    }));

    return {
      type: 'start_game',
      resArr
    }
  }
}

export default preGameHandler;