import { IShip, IUser } from './modelsDB';

// Player
interface IPlayerReq {
  type: 'reg';
  data: Omit<IUser, 'id'>;
  id: 0;
}

interface IPlayerRes {
  type: 'reg';
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: 0;
}

interface IWinnerRes {
  type: 'update_winners';
  data: {
    name: string;
    wins: number;
  };
  id: 0;
}
// Room
interface ICreateRoomReq {
  type: 'create_room';
  data: '';
  id: 0;
}

interface IAddPlayerReq {
  type: 'add_player_to_room';
  data: {
    indexRoom: number;
  };
  id: 0;
}

interface ICreateGameRes {
  type: 'create_game';
  data: {
    idGame: number;
    idPlayer: number;
  };
  id: 0;
}

interface IUpdateRoomRes {
  type: 'update_room';
  data: {
    roomId: number;
    roomUsers: {
      name: string;
      index: number;
    }[];
  };
  id: 0;
}
// Ship
interface IAddShipsReq {
  type: 'add_ships';
  data: {
    gameId: number;
    ships: IShip[];
    indexPlayer: number;
  };
  id: 0;
}
// Game actions
interface IAttackReq {
  type: 'attack';
  data: {
    gameID: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
  id: 0;
}

interface IAttackRes {
  type: 'attack';
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: 'miss' | 'killed' | 'shot';
  };
  id: 0;
}

interface IRandomAttackReq {
  type: 'attack';
  data: {
    gameID: number;
    indexPlayer: number;
  };
  id: 0;
}
// Turns
interface IChangeTurnRes {
  type: 'turn';
  data: {
    currentPlayer: number;
  };
  id: 0;
}

interface IFinishGameRes {
  type: 'finish';
  data: {
    winPlayer: number;
  };
  id: 0;
}

export {
  IPlayerReq,
  IPlayerRes,
  IWinnerRes,
  ICreateRoomReq,
  IUpdateRoomRes,
  IAddPlayerReq,
  ICreateGameRes,
  IAddShipsReq,
  IAttackReq,
  IAttackRes,
  IRandomAttackReq,
  IChangeTurnRes,
  IFinishGameRes,
};
