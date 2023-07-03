interface IDB {
  users: IUser[];
  rooms: IRoom[];
  games: IGame[];
}

interface IUser {
  id: number;
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
    id: number;
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

export { IUser, IShip, IDB };
