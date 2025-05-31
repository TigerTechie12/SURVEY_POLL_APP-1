import { JWT_SECRET } from "../config/i";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function Verify(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send("Unauthorized");
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            res.status(403).send("Unable to verify");
            return;
        }
        (req as any).user = decoded;
        next();
    } catch (e) {
        res.status(401).send("Failed to authenticate");
    }
}
