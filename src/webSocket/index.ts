import { WebSocketServer, createWebSocketStream } from 'ws';
import 'dotenv/config';
import loginHandler from '../handlers/loginHandler.js';
import roomHandler from '../handlers/roomHandler.js';

const WS_PORT = process.env.WS_PORT;
let connection_id = 0;

const wsServer = new WebSocketServer({ port: Number(WS_PORT) });

wsServer.on('connection', (socket, req) => {
  const duplex = createWebSocketStream(socket, {
    encoding: 'utf8',
    decodeStrings: false,
  });

  const CLIENT_ID = connection_id++;

  console.log('\x1b[33m%s\x1b[0m', `Established WebSocket connection with ${req.headers.origin}\0`);
  console.log('\x1b[34m%s\x1b[0m', `Params: ${req.rawHeaders}`);
  duplex.write(`Connected_to_${req.headers.host}\0`);

  duplex.on('data', (data) => {
    console.log(`\x1b[35mreceived\x1b[0m: ${data}`);

    const req = JSON.parse(data);
    req.data = req.data ? JSON.parse(req.data) : '';
    req.id = CLIENT_ID;

    let res;

    switch (req.type) {
      case 'reg':
        res = loginHandler(req);
        break;
      case 'create_room':
        res = roomHandler(req);
        break;
      case 'mouse_left':
        break;
      case 'mouse_right':
        break;
      case 'mouse_position':
        break;
      case 'draw_circle':
        break;
      case 'draw_rectangle':
        break;
      case 'draw_square':
        break;
      case 'prnt_scrn':
        break;
    }

    if (res) {
      const { type, id, data } = res;
      const serverRes = {
        type,
        data: JSON.stringify(data),
        id,
      };

      duplex.write(JSON.stringify(serverRes));
      console.log(`\x1b[36msent\x1b[0m: ${JSON.stringify(serverRes)}`);
    }
  });

  duplex.on('error', (err) => {
    console.log('\x1b[32m%s\x1b[0m', err.message);
  });

  socket.on('close', () => {
    console.log('\x1b[31m%s\x1b[0m', `${req.headers.origin} disconnected\0`);
  });
});

export default wsServer;
