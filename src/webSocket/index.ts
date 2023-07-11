import { WebSocketServer, WebSocket } from 'ws';
import 'dotenv/config';
import loginHandler from '../handlers/loginHandler.js';
import roomHandler from '../handlers/roomHandler.js';
import { createShipPositions, formServerResJson } from '../utils/index.js';
import updateRoomsRes from '../handlers/updateRooms.js';
import preGameHandler from '../handlers/preGameHandler.js';
import attackHandler from '../handlers/attackHandler.js';
import {
  addShips,
  addUser,
  createRoom,
  deleteGame,
  deleteRoom,
  findPlayerGame,
  findPlayerRoom,
  getEnemyPlayer,
  hasPlayerWon,
  isThisPlayerTurn,
  passTurn,
} from '../dbHelpers/index.js';
import turnRes from '../handlers/turnRes.js';
import finishGameHandler from '../handlers/finishGameHandler.js';
import winnerRecordHandler from '../handlers/winnerRecordHandler.js';
import { ICreateGameRes, IGame } from '../models';

const WS_PORT = process.env.WS_PORT;
const clients: { ws: WebSocket; id: number; playerId: number | undefined; singlePlayer: boolean }[] = [];

const wsServer = new WebSocketServer({ port: Number(WS_PORT) });

wsServer.on('connection', (ws, req) => {
  const CLIENT_ID = clients.length;
  clients.push({ ws, id: CLIENT_ID, playerId: undefined, singlePlayer: false });

  const sendAllClients = (data: string) => clients.forEach(({ ws }) => ws.send(data));
  const sendSpecificClients = (data: string, clientsId: number[]) => {
    clients
      .filter(({ playerId }) => playerId !== undefined && clientsId.includes(playerId))
      .forEach(({ ws }) => ws.send(data));
  };

  console.log('\x1b[33m%s\x1b[0m', `Established WebSocket connection with ${req.headers.origin}\0`);
  console.log('\x1b[34m%s\x1b[0m', `Params: ${req.rawHeaders}`);
  ws.send(`Connected_to_${req.headers.host}\0`);

  ws.on('message', (data) => {
    console.log(`\x1b[35mreceived\x1b[0m: ${data.toString()}`);

    const PLAYER_ID = clients[CLIENT_ID].playerId ?? CLIENT_ID;
    const req = JSON.parse(data.toString());
    req.data = req.data ? JSON.parse(req.data) : '';
    req.id = PLAYER_ID;

    let res;

    switch (req.type) {
      case 'reg':
        res = loginHandler(req);
        clients[CLIENT_ID].playerId = res.data.index;
        break;
      case 'create_room':
      case 'add_user_to_room':
        res = roomHandler(req);
        break;
      case 'add_ships':
        res = preGameHandler(req);
        break;
      case 'attack':
      case 'randomAttack':
        if (!isThisPlayerTurn(req.data.indexPlayer)) break;
        res = attackHandler(req);
        if (hasPlayerWon(PLAYER_ID)) res = finishGameHandler(PLAYER_ID);
        break;
      case 'single_play': {
        const BOT_ID = (PLAYER_ID + 1) * 1000;
        addUser({
          name: `Bot #${BOT_ID}`,
          password: '',
          index: BOT_ID,
        });

        const currentRoom = findPlayerRoom(PLAYER_ID);
        if (currentRoom) deleteRoom(currentRoom.roomId);

        const { roomId } = createRoom(PLAYER_ID);
        const res = <{ type: 'create_game'; resArr: ICreateGameRes[] }>roomHandler({
          type: 'add_user_to_room',
          data: {
            indexRoom: roomId,
          },
          id: BOT_ID,
        });

        addShips(BOT_ID, res.resArr[0].data.idGame, createShipPositions());
        ws.send(formServerResJson(res.resArr[0]));
        clients[CLIENT_ID].singlePlayer = true;

        break;
      }
    }

    //how to send response to client(s)
    if (res) {
      switch (res.type) {
        case 'reg':
          ws.send(formServerResJson(res));
          ws.send(formServerResJson(updateRoomsRes()));
          ws.send(formServerResJson(winnerRecordHandler()));
          break;
        case 'update_room':
          sendAllClients(formServerResJson(res));
          break;
        case 'create_game':
          res.resArr.forEach((res) => sendSpecificClients(formServerResJson(res), [res.data.idPlayer]));
          sendAllClients(formServerResJson(updateRoomsRes()));
          break;
        case 'start_game': {
          const players = res.resArr.map(({ data }) => data.currentPlayerIndex);
          res.resArr.forEach((res) => sendSpecificClients(formServerResJson(res), [res.data.currentPlayerIndex]));
          sendSpecificClients(formServerResJson(turnRes(CLIENT_ID)), players);
          break;
        }
        case 'attack': {
          const enemyId = getEnemyPlayer(req.data.indexPlayer)?.index ?? 0;
          const game = <IGame>findPlayerGame(PLAYER_ID);
          res.resArr.forEach((res) => sendSpecificClients(formServerResJson(res), [CLIENT_ID, enemyId]));
          if (res.resArr[0].data.status === 'miss') passTurn(game.gameId);
          sendSpecificClients(formServerResJson(turnRes(PLAYER_ID)), [CLIENT_ID, enemyId]);

          while (!isThisPlayerTurn(PLAYER_ID) && clients[CLIENT_ID].singlePlayer) {
            const botRes = attackHandler({
              type: 'randomAttack',
              data: { gameId: game.gameId, indexPlayer: enemyId },
              id: 0,
            });
            botRes.resArr.forEach((res) => setTimeout(() => ws.send(formServerResJson(res)), 500));
            if (botRes.resArr[0].data.status === 'miss') passTurn(game.gameId);

            ws.send(formServerResJson(turnRes(PLAYER_ID)));
          }
          break;
        }
        case 'finish': {
          const enemyId = getEnemyPlayer(req.data.indexPlayer)?.index ?? 0;
          sendSpecificClients(formServerResJson(res), [CLIENT_ID, enemyId]);
          sendAllClients(formServerResJson(winnerRecordHandler(PLAYER_ID)));
          deleteGame((<IGame>findPlayerGame(PLAYER_ID)).gameId);
          clients[CLIENT_ID].singlePlayer = false;
          break;
        }
        default:
          ws.send(formServerResJson(res));
      }
    }
  });

  ws.on('error', (err) => {
    console.log('\x1b[32m%s\x1b[0m', err.message);
  });

  ws.on('close', () => {
    console.log('\x1b[31m%s\x1b[0m', `${req.headers.origin} disconnected\0`);
    const PLAYER_ID = clients[CLIENT_ID].playerId ?? CLIENT_ID;

    const playerGame = findPlayerGame(PLAYER_ID);
    const userRoom = findPlayerRoom(PLAYER_ID);
    clients[CLIENT_ID].singlePlayer = false;

    if (playerGame) {
      const enemyId = getEnemyPlayer(PLAYER_ID)?.index ?? 0;
      const res = finishGameHandler(enemyId);
      sendSpecificClients(formServerResJson(res), [CLIENT_ID, enemyId]);
      sendAllClients(formServerResJson(winnerRecordHandler(enemyId)));
      deleteGame(playerGame.gameId);
    }
    if (userRoom) {
      deleteRoom(userRoom.roomId);
      sendAllClients(formServerResJson(updateRoomsRes()));
    }
  });
});

export default wsServer;
