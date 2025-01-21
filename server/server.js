import express from "express";
import url from "url";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import "./db/dbConnect.js"

const app = express();
const port = process.env.port || 3000;

const actualPath = url.fileURLToPath(import.meta.url);
const publicDirectory = path.join(actualPath, "../..", "public");
app.use(express.static(publicDirectory));

const serverHttp = http.createServer(app);

serverHttp.listen(port, () => console.log(`Server at port ${port}`));

const io = new Server(serverHttp);

export default io;