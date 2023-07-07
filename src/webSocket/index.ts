import { WebSocketServer, WebSocket } from 'ws';
import 'dotenv/config';
import loginHandler from '../handlers/loginHandler.js';
import roomHandler from '../handlers/roomHandler.js';
import { formServerResJson } from '../utils/index.js';
import updateRoomsRes from '../handlers/updateRooms.js';
import preGameHandler from '../handlers/preGameHandler.js';
import gameHandler from '../handlers/gameHandler.js';
import { findPlayerGame, getEnemyPlayer, isThisPlayerTurn, passTurn } from '../dbHelpers/index.js';
import turnRes from '../handlers/turnRes.js';

const WS_PORT = process.env.WS_PORT;
const clients: { ws: WebSocket; id: number }[] = [];

const wsServer = new WebSocketServer({ port: Number(WS_PORT) });

wsServer.on('connection', (ws, req) => {
  const CLIENT_ID = clients.length;
  clients.push({ ws, id: CLIENT_ID });

  const sendAllClients = (data: string) => clients.forEach(({ ws }) => ws.send(data));
  const sendSpecificClients = (data: string, clientsId: number[]) => {
    clients.filter(({ id }) => clientsId.includes(id)).forEach(({ ws }) => ws.send(data));
  };

  console.log('\x1b[33m%s\x1b[0m', `Established WebSocket connection with ${req.headers.origin}\0`);
  console.log('\x1b[34m%s\x1b[0m', `Params: ${req.rawHeaders}`);
  ws.send(`Connected_to_${req.headers.host}\0`);

  ws.on('message', (data) => {
    console.log(`\x1b[35mreceived\x1b[0m: ${data.toString()}`);

    const req = JSON.parse(data.toString());
    req.data = req.data ? JSON.parse(req.data) : '';
    req.id = CLIENT_ID;

    let res;

    switch (req.type) {
      case 'reg':
        res = loginHandler(req);
        break;
      case 'create_room':
      case 'add_user_to_room':
        res = roomHandler(req);
        break;
      case 'add_ships':
        res = preGameHandler(req);
        break;
      case 'attack':
        if (!isThisPlayerTurn(req.data.indexPlayer)) break;
        res = gameHandler(req);
        break;
    }

    //how to send response to client(s)
    if (res) {
      switch (res.type) {
        case 'reg':
          ws.send(formServerResJson(res));
          ws.send(formServerResJson(updateRoomsRes()));
          break;
        case 'update_room':
          sendAllClients(formServerResJson(res));
          break;
        case 'create_game':
          res.resArr.forEach((res) => sendSpecificClients(formServerResJson(res), [res.data.idPlayer]));
          sendAllClients(formServerResJson(updateRoomsRes()));
          break;
        case 'start_game':
          const players = res.resArr.map(({ data }) => data.currentPlayerIndex);
          res.resArr.forEach((res) => sendSpecificClients(formServerResJson(res), [res.data.currentPlayerIndex]));
          sendSpecificClients(formServerResJson(turnRes(req.id)), players);
          break;
        case 'attack':
          const enemyId = getEnemyPlayer(req.data.indexPlayer)?.index ?? NaN;
          res.resArr.forEach((res) => sendSpecificClients(formServerResJson(res), [res.data.currentPlayer, enemyId]));
          if (res.resArr[0].data.status === 'miss') passTurn(findPlayerGame(req.id).gameId);
          sendSpecificClients(formServerResJson(turnRes(req.id)), [req.id, enemyId]);
          break;
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
  });
});

export default wsServer;
