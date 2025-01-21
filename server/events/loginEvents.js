import { findUser } from "../db/dbUser.js"
import authenticateUser from "../utils/authenticateUser.js"
import generateJwt from "../utils/generateJwt.js"

export default function registerEventLogin(socket, io){
    //recieves name and password from login/index.html and tries to authenticate
    socket.on("user_authentication", async ({ name: name, password: password }) => {

        const user = await findUser(name)

        if(user){
            
            const authenticate = authenticateUser(password, user);
            const tokenJwt = generateJwt({ username : name });

            authenticate ?  
            socket.emit("success_autentication", tokenJwt) :  
            socket.emit("authentication_error_password")
   
        }else{
            socket.emit("authentication_error_name")
        }
    })
}