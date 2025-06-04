import { BACKEND_URL } from "../config/index";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

interface Survey {
    title: string;
   
    responses: number;
    date: number;
    id: string;
    createdAt: string;
    questions: {
        id: string;
        title: string;
        options: {
            id: string;
            text: string;
        }[];
    }[];
}

export function RenderSurvey() {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const { surveyId } = useParams<{ surveyId: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [questionEdit,setQuestionEdit]=useState<string>('')
    const [optionEdit,setOptionEdit]=useState<string>('')

    useEffect(() => {
        async function fetchSurvey() {
            if (!surveyId) {
                setError('Survey ID is missing');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${BACKEND_URL}/survey/${surveyId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Survey data:', res.data); 
                setSurvey(res.data.survey);
            } catch (err) {
                console.error('Error fetching survey:', err);
                setError('Failed to load survey');
            } finally {
                setLoading(false);
            }
        }

        fetchSurvey();
    }, [surveyId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-600">Loading survey...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">Survey not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{survey.title}</h1></div>
            <div>{survey.questions.map((q)=>(
                <div key={q.id}>
                  <div>{q.title}</div>
                  <input type="text" placeholder="Edit Question" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setQuestionEdit(e.target.value)}} />
                   <button 
                                onClick={() => {async()=>{
                                    const res=await axios.put(`${BACKEND_URL}/survey/${surveyId}/question/${q.id}`,{
                                        questionEdit
                                    },{
                                         headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                                    })
                                console.log("Question updated",res.data)
                                }} }
                                className="flex items-center gap-2 bg-slate-500 text-black px-4 py-2 rounded hover:bg-slate-600"
                            >
                               
                                <span className="font-semibold">Edit</span>
                            </button>
                  {q.options.map((o)=>(
                    <div key={o.id}>
                        <div className="flex flex-col">{o.text}</div>
  <input type="text" placeholder="Edit Option" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setOptionEdit(e.target.value)}} />
                   <button 
                                onClick={() => {async()=>{
                                    const res=await axios.put(`${BACKEND_URL}/survey/${surveyId}/question/${q.id}/option/${o.id}`,{
                                        optionEdit
                                    },{
                                         headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                                    })
                                console.log("Option updated",res.data)
                                }} }
                                className="flex items-center gap-2 bg-slate-500 text-black px-4 py-2 rounded hover:bg-slate-600"
                            >
                               
                                <span className="font-semibold">Edit</span>
                            </button>

                          
                    </div>
                  ))}

                </div>
            ))}</div>
             <div className="mt-6 text-sm text-gray-500">
                    <div>Created: {new Date(survey.createdAt).toLocaleDateString()}</div>
                    <div>Responses: {survey.responses}</div>
                </div>

        </div>
    );
}