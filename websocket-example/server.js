import http from "http";
import { Server } from "socket.io";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // ✅ important!
  },
});

io.on("connection", (socket) => {
  console.log("✅ New user connected:", socket.id);

  io.emit("welcome", `Welcome onboard`);

  socket.emit("only-socket", `Hello Socket - ${socket.id}`);

  socket.broadcast.emit("user:joined", `A Socket ${socket.id} joined`);

  socket.join("room1");

  io.to("room1").emit("room1:message", `Welcome to room1`);
  socket.to("room1").emit("room1:message", "New message from", socket.id);

  socket.on("welcome", (msg) => {
    console.log(msg);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
