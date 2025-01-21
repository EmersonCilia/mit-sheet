import { registerUser, findUser }from "../db/dbUser.js";


export default function registerEventUser(socket, io) {
    socket.on("register_user", async (data) => {

        const user = await findUser(data.name);

        if(user === null){
            const result = await registerUser(data);

            if(result.acknowledged){
                socket.emit("success_register");
            }else{
                socket.emit("error_register");
            }
        }else{
            socket.emit("existing_user")
        }
    })
}