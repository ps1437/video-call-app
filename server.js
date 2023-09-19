import { Server } from "socket.io";

const PORT = process.env.PORT || 8000;

const io = new Server(PORT, {
  cors: true,
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
