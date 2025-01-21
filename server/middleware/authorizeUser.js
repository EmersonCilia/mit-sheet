import jwt from "jsonwebtoken";

//function to verify authentication
export default function authorizeUser(socket, next) {

    const tokenJwt = socket.handshake.auth.token;
    
    try {
        const payloadToken = jwt.verify(tokenJwt, process.env.JWT_SECRET);
        socket.emit("success_authorization", payloadToken)
        next();
    } catch (error) {
        next(error)
    }
}