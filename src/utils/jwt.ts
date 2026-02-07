import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret-key"; // move to env later

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d"});
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}