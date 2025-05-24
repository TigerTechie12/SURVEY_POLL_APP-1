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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const m_1 = require("../middleware/m");
app.use(m_1.verify);
surveyRouter.get('/surveys', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveys = yield prisma.survey.findMany({ include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
                User: true
            }, });
        res.send({ surveys });
    }
    catch (e) {
        res.status(411);
    }
}));
surveyRouter.post('/surveys', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const userid = req.body.userid;
    const questions = req.body.questions;
    try {
        const createSurvey = yield prisma.survey.create({
            data: { title, userid,
                questions: {
                    create: questions.map((q) => ({ title: q.title,
                        options: { create: q.options.map((o) => ({
                                text: o.text
                            }))
                        }
                    })),
                },
            }
        });
        res.send("Survey Uploaded");
    }
    catch (e) {
        res.status(411);
    }
}));
surveyRouter.get('/surveys/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const surveyid = parseInt(req.params.id);
    try {
        const findSurvey = yield prisma.survey.findUnique({
            where: { id: surveyid },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                }, User: true,
            }
        });
        if (!findSurvey) {
            return res.status(411);
        }
        res.send({ findSurvey });
    }
    catch (e) {
        res.status(411);
    }
}));
surveyRouter.put('/surveys/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const surveyid = parseInt(req.params.id);
    const questions = req.body.questions;
    const title = req.body.title;
    const updatedData = {};
    if (title) {
        updatedData.title = title;
    }
    if (questions) {
        updatedData.questions = {
            update: questions.map((q) => ({
                where: { id: q.id },
                data: {
                    title: q.title,
                    options: {
                        update: q.options.map((o) => ({
                            where: { id: o.id },
                            data: {
                                text: o.text
                            },
                        }))
                    }
                }
            }))
        };
    }
    try {
        const updateSurvey = yield prisma.survey.update({
            where: { id: surveyid },
            data: updatedData
        });
    }
    catch (e) {
        res.status(411);
    }
}));
surveyRouter.delete('/surveys/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const surveyid = parseInt(req.params.id);
    try {
        const finaldelete = yield prisma.survey.delete({
            where: { id: surveyid },
        });
    }
    catch (e) {
        res.status(411);
    }
}));
