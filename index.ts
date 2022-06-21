import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import 'dotenv/config';

const HTTP_PORT = process.env.PORT;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}/`);
});
