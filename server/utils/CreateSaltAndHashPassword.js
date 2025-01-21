import { randomBytes, scryptSync } from "crypto";

export default function createSaltAndHash(password){

    const saltPassword = randomBytes(16).toString("hex");
    const hashPassword = scryptSync (password, saltPassword, 64).toString("hex")

    return { saltPassword, hashPassword };
}