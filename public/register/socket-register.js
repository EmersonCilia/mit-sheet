const socket = io();    

export default function emitUserRegister (data){

    socket.emit("register_user", data)
}

socket.on("success_register", () => alert ("Register realized with success!"));
socket.on("error_register", () => alert ("Error, register could not be finished."));
socket.on("existing_user", () => alert ("User already exist."));