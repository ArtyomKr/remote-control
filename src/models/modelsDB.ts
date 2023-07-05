interface IDB {
  users: IUser[];
  rooms: IRoom[];
  games: IGame[];
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
  }[];
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

export { IUser, IShip, IRoom, IGame, IDB, IDBWrapped };
