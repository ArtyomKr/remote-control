import { httpServer } from './src/http_server/index.js';
import 'dotenv/config';
import wsServer from './src/webSocket/index.js';

const HTTP_PORT = process.env.PORT;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}/`);
});

wsServer;

process.on('SIGINT', () => {
  wsServer.clients.forEach((socket) => {
    socket.close();
  });
  process.exit(0);
})