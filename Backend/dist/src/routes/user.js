"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// JWT secret key - should be in environment variables in production
const JWT_SECRET = 'your-secret-key';
const signupInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    password: zod_1.z.string().min(8)
});
const signinInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const { success } = signupInput.safeParse({ email, password, name });
    if (!success) {
        res.status(411).json({ message: "Invalid input" });
        return;
    }
    try {
        const existingUser = yield prisma.user.findFirst({
            where: { email: email }
        });
        if (existingUser) {
            res.status(411).json({ message: "User already exists" });
            return;
        }
        const user = yield prisma.user.create({
            data: {
                email,
                password, // Note: You should hash the password before saving
                name
            }
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const signinHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const { success } = signinInput.safeParse({ email, password });
    if (!success) {
        res.status(411).json({ message: "Invalid input" });
        return;
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email: email,
                password: password // Note: You should compare hashed passwords
            }
        });
        if (!user) {
            res.status(411).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Error in signin:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ message: "Access token required" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
router.post('/signup', signupHandler);
router.post('/signin', signinHandler);
exports.default = router;
