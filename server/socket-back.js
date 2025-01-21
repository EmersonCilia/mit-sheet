import "dotenv/config"

import io from "./server.js";
import { EventEmitter } from "events";
import eventRegisterDocument from "./events/documentEvents.js";
import eventRegisterIndex from "./events/indexEvents.js";
import registerEventUser from "./events/registerEvents.js"
import registerEventLogin from "./events/loginEvents.js"
import authorizeUser from "./middleware/authorizeUser.js";

EventEmitter.defaultMaxListeners = 20000


const nspUsers = io.of("/users")
nspUsers.use(authorizeUser) //uses a middleware to verify if the login was made correctly

nspUsers.on("connection", (socket) => {
  socket.setMaxListeners(20000);
  console.log("New client connected", socket.id);
  eventRegisterIndex(socket, nspUsers);
  eventRegisterDocument(socket, nspUsers);
})

io.of("/").on("connection", (socket) =>{
  registerEventUser(socket, io);
  registerEventLogin(socket, io)
})