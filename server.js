import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? '', true);
    handle(req, res, parsedUrl).catch((err) => {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A client connected');
  
    socket.on('chat message', (msg) => {
      console.log('Message received:', msg);
      io.emit('chat message', msg); // Broadcast the message to all connected clients
    });
  
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}).catch((err) => {
  console.error('Error preparing app:', err);
});