import  jwt from "jsonwebtoken";

export default function generateJwt(payload) { 
    const tokenJwt = jwt.sign(payload, "segredo",{
        expiresIn: "90d"
    });

    return tokenJwt
 }