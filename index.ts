import { httpServer } from './src/http_server/index.js';
import readline from 'readline';
import 'dotenv/config';
import wsServer from './src/webSocket/index.js';

const HTTP_PORT = process.env.PORT;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Front-end running at http://localhost:${HTTP_PORT}/`);
});

wsServer;

process.on('SIGINT', () => {
  wsServer.clients.forEach((socket) => {
    socket.close();
  });

  setTimeout(() => process.exit(0), 500);
})

if (process.platform === 'win32') {
  const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  });
  
  rl.on("SIGINT", function () {
    process.emit('SIGINT', 'SIGINT');
  });
}