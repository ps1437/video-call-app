import { Server } from "socket.io";
import express from 'express';
const app = express();
import http  from "http";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const httpServer = http.Server(app);


const PORT = process.env.PORT || 8000;

const io = new Server(PORT, {
  cors: true,
});

// Serve static files from the public directory
app.use(express.static(__dirname + '/client/build'));
app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});


io.on("connection", (socket) => {
  socket.emit("myId", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, data, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: data, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// Start server
httpServer.listen(3001, () => {
  console.log(`Server running on port ${3001}.`);
});