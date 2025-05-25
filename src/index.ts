import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import surveyRouter from './routes/survey';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/survey', surveyRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
