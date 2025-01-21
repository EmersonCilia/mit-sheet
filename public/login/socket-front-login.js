import { defineCookie } from "../utils/cookies.js";

const socket = io();
//verify information from front end and compare with the back end, if something is wrong throws an error
export default function emitAuthenticateUser (data){
    socket.emit("user_authentication", data)
}

socket.on("success_autentication", (tokenJwt) => {

    defineCookie("tokenJwt", tokenJwt);
    alert("User authenticate with success!")
    window.location.href = "/"
})

socket.on("authentication_error_password", () => alert("authetication error, incorrect password"))
socket.on("authentication_error_name", () => alert("authetication error, user doesn't exist"))