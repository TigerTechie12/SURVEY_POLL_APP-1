import { Request, Response, Router } from 'express'
import { PrismaClient } from '../../generated/prisma'
import { Verify } from '../middleware/m'

const prisma = new PrismaClient()
const router = Router()

router.use(Verify)

router.get('/bulk', async (req: Request, res: Response) => {
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
        })
        res.json({ surveys })
    } catch (error) {
        console.error('Error fetching surveys:', error)
        res.status(500).json({ message: 'Failed to fetch surveys' })
    }
})

router.post('/', async (req: Request, res: Response) => {
    const { title, questions } = req.body
    const userId = (req as any).user.userId

    try {
        const survey = await prisma.survey.create({
            data: {
                title,
                userId,
                createdAt: new Date().toISOString(),
                questions: {
                    create: questions.map((q: any) => ({
                        title: q.title,
                        options: {
                            create: q.options.map((o: any) => ({
                                text: typeof o === 'string' ? o : o.text
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
        })
        res.status(201).json({ message: 'Survey created successfully', survey })
    } catch (error) {
        console.error('Error creating survey:', error)
        res.status(500).json({ message: 'Failed to create survey' })
    }
})

router.get('/:id', async (req: Request, res: Response) => {
    const surveyId = parseInt(req.params.id as string)
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
        })

        if (!survey) {
            res.status(404).json({ message: 'Survey not found' })
            return
        }

        res.json({ survey })
    } catch (error) {
        console.error('Error fetching survey:', error)
        res.status(500).json({ message: 'Failed to fetch survey' })
    }
})

router.put('/:id', async (req: Request, res: Response) => {
    const surveyId = parseInt(req.params.id as string)
    const { title, questions } = req.body
    const userId = (req as any).user.userId

    try {
        const existingSurvey = await prisma.survey.findUnique({
            where: { id: surveyId }
        })

        if (!existingSurvey) {
            res.status(404).json({ message: 'Survey not found' })
            return
        }

        if (existingSurvey?.userId !== userId) {
            res.status(403).json({ message: 'Not authorized to update this survey' })
            return
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
        })

        res.json({ message: 'Survey updated successfully', survey: updatedSurvey })
    } catch (error) {
        console.error('Error updating survey:', error)
        res.status(500).json({ message: 'Failed to update survey' })
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    const surveyId = parseInt(req.params.id as string)
    const userId = (req as any).user.userId

    try {
        const existingSurvey = await prisma.survey.findUnique({
            where: { id: surveyId }
        })

        if (!existingSurvey) {
            res.status(404).json({ message: 'Survey not found' })
            return
        }

        if (existingSurvey?.userId !== userId) {
            res.status(403).json({ message: 'Not authorized to delete this survey' })
            return
        }

        await prisma.survey.delete({
            where: { id: surveyId }
        })

        res.json({ message: 'Survey deleted successfully' })
    } catch (error) {
        console.error('Error deleting survey:', error)
        res.status(500).json({ message: 'Failed to delete survey' })
    }
})

export default router
