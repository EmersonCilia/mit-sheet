import { usersColection } from "./dbConnect.js";
import createSaltAndHash from "../utils/CreateSaltAndHashPassword.js";

function registerUser({ name, password }){

    const { hashPassword, saltPassword } = createSaltAndHash(password);

    return usersColection.insertOne({ name, hashPassword, saltPassword })
}

function findUser(name){
    return usersColection.findOne({ name });
}

export { registerUser, findUser }