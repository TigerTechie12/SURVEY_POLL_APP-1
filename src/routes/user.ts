import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

const signupInput = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(8)
});

const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});
type SignupRequestBody = z.infer<typeof signupInput>;
type SigninRequestBody = z.infer<typeof signinInput>;

router.post('/signup', async (req: Request<{}, {}, SignupRequestBody>, res: Response) => {
    const { email, password, name } = req.body;
    
    const result = signupInput.safeParse({ email, password, name });
    if (!result.success) {
        res.status(400).json({ message: "Invalid input", errors: result.error.errors });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key');
        res.status(201).json({ 
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/signin', async (req: Request<{}, {}, SigninRequestBody>, res: Response) => {
    const { email, password } = req.body;
    
    const result = signinInput.safeParse({ email, password });
    if (!result.success) {
        res.status(400).json({ message: "Invalid input", errors: result.error.errors });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
<<<<<<< HEAD:Backend/src/routes/user.ts
=======
	    return
>>>>>>> 152559ad1a17d89b54484bdd3a76be7e3adb83c7:src/routes/user.ts
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
<<<<<<< HEAD:Backend/src/routes/user.ts
           res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key');
       res.status(200).json({ 
=======
            res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key');
        res.status(200).json({ 
>>>>>>> 152559ad1a17d89b54484bdd3a76be7e3adb83c7:src/routes/user.ts
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
