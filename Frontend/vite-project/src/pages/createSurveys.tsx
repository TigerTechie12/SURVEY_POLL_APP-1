import { BACKEND_URL } from "../config/index";
import { useState, useEffect } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

type Option = string;

interface Question {
    questionText: string;
    options: Option[];
}

export function CreateSurveys() {
    const [questions, setQuestions] = useState<Question[]>([{
        questionText: '',
        options: ["", ""]
    }]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function DeleteQuestions(questionIndex: number) {
        setQuestions(prev => prev.filter((_, index) => index !== questionIndex));
    }

    function DeleteOptions(questionIndex: number, optIndex: number) {
    const copy=[...questions]
    const final=copy[questionIndex].options[optIndex]
    const f=copy[questionIndex].options  //this will still point to the options array of in-memory array i.e. questions array
    const fagain=f.filter((_,index)=>index !=optIndex)
   
    copy[questionIndex]={
        ...copy[questionIndex],
        options:fagain
    }
setQuestions(copy)

    }

    function AddQuestions() {
        setQuestions(prev => [...prev, { questionText: '', options: [''] }]);
    }

    function AddOptions(questionIndex: number) {
        setQuestions(prev => {
            const updated = [...prev];
            updated[questionIndex].options.push('');
            return updated;
        });
    }

    async function submitResponse() {
        console.log('Button clicked, current isSubmitting:', isSubmitting);
        try {
            console.log('Setting isSubmitting to true');
            setIsSubmitting(true);
            console.log('After setting isSubmitting to true:', isSubmitting);
            
            const res = await axios.post(
                `${BACKEND_URL}/survey`,
                {
                    title,
                    description,
                    questions: questions.map(q => ({
                        title: q.questionText,
                        options: q.options
                    }))
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            
            console.log("Survey submitted successfully:", res.data);
        } catch (error) {
            console.error("Error submitting survey:", error);
        } finally {
            console.log('Setting isSubmitting to false');
            setIsSubmitting(false);
            console.log('After setting isSubmitting to false:', isSubmitting);
        }
    }

    return (<div> 
        <div className="flex flex-row justify-between">
            <div className="font-bold">Survey Questions</div>
          <button 
                onClick={AddQuestions}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Add Question
            </button>
        </div>
          

        <div className="flex flex-col gap-4 p-4">
            <div>
                <div className="font-semibold mb-2">Survey Title *</div>
                <input 
                    type="text" 
                    placeholder="eg., Customer Satisfaction Survey" 
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <div className="font-semibold mb-2">Survey Description *</div>
                <input 
                    type="text" 
                    placeholder="Briefly describe what this survey is about and why you are conducting it" 
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="space-y-6">
                {questions.map((q, questionIndex) => (
                    <div key={questionIndex} className="border p-4 rounded">
                        <div className="flex flex-row justify-between items-center mb-2">
                            <div className="font-semibold">Question {questionIndex + 1}</div>
                            <button 
                                onClick={() => DeleteQuestions(questionIndex)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete Question
                            </button>
                        </div>
                        <div className="mb-2">
                            <div className="font-semibold mb-1">Question Text *</div>
                            <input 
                                type="text" 
                                value={q.questionText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const updated = [...questions];
                                    updated[questionIndex].questionText = e.target.value;
                                    setQuestions(updated);
                                }}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-row justify-between items-center mb-2">
                            <div className="font-semibold">Answer Options</div>
                            <button 
                                onClick={() => AddOptions(questionIndex)} 
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                <span className="text-lg font-bold">＋</span>
                                <span className="font-semibold">Add Option</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex gap-2 items-center">
                                    <input 
                                        type="text" 
                                        value={opt}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const updated = [...questions];
                                            updated[questionIndex].options[optIndex] = e.target.value;
                                            setQuestions(updated);
                                        }}
                                        className="flex-1 p-2 border rounded"
                                    />
                                    <button 
                                        onClick={() => DeleteOptions(questionIndex, optIndex)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

           
        </div>
          <button 
                onClick={submitResponse}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                    isSubmitting 
                        ? 'bg-green-300 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'
                } text-white`}
            >
                <span className="font-semibold">
                    {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                </span>
            </button>
        </div>
    );
}
