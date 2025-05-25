import { Request, Response, Router } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { Verify } from '../middleware/m';

const prisma = new PrismaClient();
const router = Router();

router.use(Verify);

router.get('/surveys', async (req: Request, res: Response) => {
    try {
        const surveys = await prisma.survey.findMany({
            include: {
                questions: {
                    include: {
                        options: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
        res.json({ surveys });
    } catch (error) {
        console.error('Error fetching surveys:', error);
        res.status(500).json({ message: 'Failed to fetch surveys' });
    }
});

// Create a new survey
router.post('/surveys', async (req: Request, res: Response) => {
    const { title, questions } = req.body;
    const userId = (req as any).user.userId; // Get userId from JWT token

    try {
        const survey = await prisma.survey.create({
            data: {
                title,
                userId,
                questions: {
                    create: questions.map((q: any) => ({
                        title: q.title,
                        options: {
                            create: q.options.map((o: any) => ({
                                text: o.text
                            }))
                        }
                    }))
                }
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });
        res.status(201).json({ message: 'Survey created successfully', survey });
    } catch (error) {
        console.error('Error creating survey:', error);
        res.status(500).json({ message: 'Failed to create survey' });
    }
});

// Get a survey by ID
router.get('/surveys/:id', async(req: Request, res: Response) => {
    const surveyId = parseInt(req.params.id);
    try {
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (!survey) {
            res.status(404).json({ message: 'Survey not found' });
        }

        res.json({ survey });
    } catch (error) {
        console.error('Error fetching survey:', error);
        res.status(500).json({ message: 'Failed to fetch survey' });
    }
});

// Update a survey by ID
router.put('/surveys/:id', async (req: Request, res: Response) => {
    const surveyId = parseInt(req.params.id);
    const { title, questions } = req.body;
    const userId = (req as any).user.userId;

    try {
        // First check if survey exists and belongs to user
        const existingSurvey = await prisma.survey.findUnique({
            where: { id: surveyId }
        });

        if (!existingSurvey) {
            res.status(404).json({ message: 'Survey not found' });
        }

        if (existingSurvey?.userId !== userId) {
            res.status(403).json({ message: 'Not authorized to update this survey' });
        }

        const updatedSurvey = await prisma.survey.update({
            where: { id: surveyId },
            data: {
                title,
                questions: {
                    update: questions.map((q: any) => ({
                        where: { id: q.id },
                        data: {
                            title: q.title,
                            options: {
                                update: q.options.map((o: any) => ({
                                    where: { id: o.id },
                                    data: { text: o.text }
                                }))
                            }
                        }
                    }))
                }
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        res.json({ message: 'Survey updated successfully', survey: updatedSurvey });
    } catch (error) {
        console.error('Error updating survey:', error);
        res.status(500).json({ message: 'Failed to update survey' });
    }
});

// Delete a survey by ID
router.delete('/surveys/:id', async (req: Request, res: Response) => {
    const surveyId = parseInt(req.params.id);
    const userId = (req as any).user.userId;

    try {
        // First check if survey exists and belongs to user
        const existingSurvey = await prisma.survey.findUnique({
            where: { id: surveyId }
        });

        if (!existingSurvey) {
            res.status(404).json({ message: 'Survey not found' });
        }

        if (existingSurvey?.userId !== userId) {
            res.status(403).json({ message: 'Not authorized to delete this survey' });
        }

        await prisma.survey.delete({
            where: { id: surveyId }
        });

        res.json({ message: 'Survey deleted successfully' });
    } catch (error) {
        console.error('Error deleting survey:', error);
        res.status(500).json({ message: 'Failed to delete survey' });
    }
});

export default router;
