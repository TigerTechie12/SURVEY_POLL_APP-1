import express from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import surveyRouter from './routes/survey';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', userRouter);
app.use('/survey', surveyRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
