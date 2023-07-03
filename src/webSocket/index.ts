import { WebSocketServer, createWebSocketStream } from 'ws';
import 'dotenv/config';

const WS_PORT = process.env.WS_PORT;

const wsServer = new WebSocketServer({ port: Number(WS_PORT) });

wsServer.on('connection', (socket, req) => {
  const duplex = createWebSocketStream(socket, {
    encoding: 'utf8',
    decodeStrings: false,
  });

  console.log('\x1b[33m%s\x1b[0m', `Established WebSocket connection with ${req.headers.origin}\0`);
  console.log('\x1b[34m%s\x1b[0m', `Params: ${req.rawHeaders}`);
  duplex.write(`Connected_to_${req.headers.host}\0`);

  duplex.on('data', (data) => {
    console.log(`\x1b[35mreceived\x1b[0m: ${data}`);
    const packet = data.toString().split(' ');
    const command = packet[0];

    switch (command) {
      case 'mouse_up':
        break;
      case 'mouse_down':
        break;
      case 'mouse_left':
        break;
      case 'mouse_right':
        break;
      case 'mouse_position':
        const res = `mouse_position \0`;
        duplex.write(res);
        console.log(`\x1b[36msend\x1b[0m: ${res}`);
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
  });

  socket.on('close', () => {
    console.log('\x1b[31m%s\x1b[0m', `${req.headers.origin} disconnected\0`);
  });
});

export default wsServer;
