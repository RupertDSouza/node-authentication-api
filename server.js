const http = require("http");

const port = process.env.PORT || 3000;
const db = require("./config/db");

const app = require("./app");

const server = http.createServer(app);

server.listen(port);
