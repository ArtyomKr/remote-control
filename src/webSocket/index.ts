import fs from 'fs';
import robot from 'robotjs';
import Jimp from 'jimp';
import { WebSocketServer, createWebSocketStream } from 'ws';
import 'dotenv/config';
import drawCircle from '../utils/circle.js';
import drawRectangle from '../utils/rectangle.js';

const WS_PORT = process.env.WS_PORT;

const wsServer = new WebSocketServer({ port: Number(WS_PORT) });

wsServer.on("connection", (socket, req) => {
  const duplex = createWebSocketStream(socket, { encoding: 'utf8', decodeStrings: false });
  duplex.on('data', (data) => console.log(data));

  console.log(`Established connection with ${req.socket.remoteAddress}`);
  socket.send('Connection_established\0');

  socket.on("message", (data) => {
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
        const res = `mouse_position ${mousePos.x},${mousePos.y}`;
        duplex.write(res);
        duplex.push(res);
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
        break;  
    }
  });

  socket.on('close', () => {
    console.log(`${req.socket.remoteAddress} disconnected`);
  });
});

export default wsServer;