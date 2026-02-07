import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

const JWT_SECRET = "super-secret-key";

export function authGuard(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if(!header) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;
      next();  
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};