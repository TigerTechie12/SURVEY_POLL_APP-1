"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = verify;
const i_1 = require("../config/i");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verify(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send("unauthorized");
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, i_1.JWT_SECRET);
        if (!decoded) {
            return res.status(403).send("Unable to verify");
        }
        req.user = decoded;
        next();
    }
    catch (e) {
        res.send("Failed");
    }
}
