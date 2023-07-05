import { IRoom, IShip, IUser } from './modelsDB';

// Player
interface IPlayerReq {
  type: 'reg';
  data: Omit<IUser, 'index'>;
  id: number;
}

interface IPlayerRes {
  type: 'reg';
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
}

interface IWinnerRes {
  type: 'update_winners';
  data: {
    name: string;
    wins: number;
  };
  id: number;
}
// Room
interface ICreateRoomReq {
  type: 'create_room';
  data: '';
  id: number;
}

interface IAddPlayerReq {
  type: 'add_user_to_room';
  data: {
    indexRoom: number;
  };
  id: number;
}

interface ICreateGameRes {
  type: 'create_game';
  data: {
    idGame: number;
    idPlayer: number;
  };
  id: number;
}

interface IUpdateRoomRes {
  type: 'update_room';
  data: IRoom[];
  id: number;
}
// Ship
interface IAddShipsReq {
  type: 'add_ships';
  data: {
    gameId: number;
    ships: IShip[];
    indexPlayer: number;
  };
  id: number;
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
  id: number;
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
  id: number;
}

interface IRandomAttackReq {
  type: 'attack';
  data: {
    gameID: number;
    indexPlayer: number;
  };
  id: number;
}
// Turns
interface IChangeTurnRes {
  type: 'turn';
  data: {
    currentPlayer: number;
  };
  id: number;
}

interface IFinishGameRes {
  type: 'finish';
  data: {
    winPlayer: number;
  };
  id: number;
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
