import { scryptSync, timingSafeEqual } from "crypto";

export default function  authenticateUser(password, user) {

    const testHash = scryptSync(password, user.saltPassword, 64);
    const realHash = Buffer.from(user.hashPassword, "hex");
    const authenticate = timingSafeEqual(testHash, realHash);

    return authenticate;
  }