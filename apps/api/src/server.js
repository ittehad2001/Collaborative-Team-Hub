const http = require("http");
const { Server } = require("socket.io");
const env = require("./config/env");
const { createApp } = require("./app");
const { initSocket } = require("./socket");

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.clientUrl, credentials: true }
});

app.use((req, _res, next) => {
  req.io = io;
  next();
});

initSocket(io);

server.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
