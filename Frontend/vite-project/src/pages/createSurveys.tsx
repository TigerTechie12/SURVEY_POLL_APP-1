import { BACKEND_URL } from "../config/index";
import { useState, useEffect } from "react";
import axios from 'axios';

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

async function submitResponse(){
try{
    const res=await axios.post(`/{BACKEND_URL},{title,description}`)
}catch(e){}
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
                        <div className="font-semibold mb-2">Question {questionIndex + 1}</div>
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
                                <div key={optIndex}>
                                    <input 
                                        type="text" 
                                        value={opt}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const updated = [...questions];
                                            updated[questionIndex].options[optIndex] = e.target.value;
                                            setQuestions(updated);
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

           
        </div>
          <button 
                onClick={submitResponse}
               
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
                <span className="font-semibold">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </span>
            </button>
        </div>
    );
}
