import robot from 'robotjs';
import { WebSocketServer, createWebSocketStream } from 'ws';
import 'dotenv/config';
import drawCircle from '../utils/circle.js';
import drawRectangle from '../utils/rectangle.js';
import takeScreen from '../utils/screen.js';

const WS_PORT = process.env.WS_PORT;

const wsServer = new WebSocketServer({ port: Number(WS_PORT) });

wsServer.on('connection', (socket, req) => {
  const duplex = createWebSocketStream(socket, {
    encoding: 'utf8',
    decodeStrings: false
  });

  console.log(
    '\x1b[33m%s\x1b[0m',
    `Established WebSocket connection with ${req.headers.origin}\0`
  );
  console.log('\x1b[34m%s\x1b[0m', `Params: ${req.rawHeaders}`);
  duplex.write(`Connected_to_${req.headers.host}\0`);

  duplex.on('data', (data) => {
    console.log(`\x1b[35mreceived\x1b[0m: ${data}`);
    const packet = data.toString().split(' ');
    const command = packet[0];
    const mousePos = robot.getMousePos();

    switch (command) {
      case 'mouse_up':
        robot.moveMouse(mousePos.x, mousePos.y - Number(packet[1]));
        break;
      case 'mouse_down':
        robot.moveMouse(mousePos.x, mousePos.y + Number(packet[1]));
        break;
      case 'mouse_left':
        robot.moveMouse(mousePos.x - Number(packet[1]), mousePos.y);
        break;
      case 'mouse_right':
        robot.moveMouse(mousePos.x + Number(packet[1]), mousePos.y);
        break;
      case 'mouse_position':
        const res = `mouse_position ${mousePos.x},${mousePos.y}\0`;
        duplex.write(res);
        console.log(`\x1b[36msend\x1b[0m: ${res}`);
        break;
      case 'draw_circle':
        drawCircle(Number(packet[1]), mousePos);
        break;
      case 'draw_rectangle':
        drawRectangle(Number(packet[2]), Number(packet[1]), mousePos);
        break;
      case 'draw_square':
        drawRectangle(Number(packet[1]), Number(packet[1]), mousePos);
        break;
      case 'prnt_scrn':
        takeScreen(mousePos, 200).then((screen) => {
          const res = `prnt_scrn ${screen}\0`;
          duplex.write(res);
          console.log(`\x1b[36msend\x1b[0m: ${res.slice(0, 100)}...`);
        });
        break;
    }
  });

  socket.on('close', () => {
    console.log(`${req.headers.origin} disconnected\0`);
  });
});

export default wsServer;
