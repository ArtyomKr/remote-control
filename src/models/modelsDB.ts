interface IDB {
  users: IUser[];
  rooms: IRoom[];
  games: IGame[];
  winners: IWinner[];
}

interface IDBWrapped {
  battleship: IDB;
}

interface IUser {
  index: number;
  name: string;
  password: string;
}

interface IRoom {
  roomId: number;
  roomUsers: Omit<IUser, 'password'>[];
}

interface IGame {
  gameId: number;
  players: {
    index: number;
    name: string;
    ships: IShip[];
    placedShips: IPlacedShip[];
    turnHistory: ITurn[];
  }[];
  userMakingTurn: number;
}

interface ITurn {
  x: number;
  y: number;
  result: 'miss' | 'killed' | 'shot';
}

interface IPlacedShip {
  pos: { x: number; y: number; destroyed: boolean }[];
  killed: boolean;
}

interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

interface IWinner {
  name: string;
  wins: number;
}

export { IUser, IShip, IPlacedShip, ITurn, IRoom, IGame, IDB, IDBWrapped };
