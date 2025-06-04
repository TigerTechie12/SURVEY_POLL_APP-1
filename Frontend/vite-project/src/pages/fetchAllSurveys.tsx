import { BACKEND_URL } from "../config/index";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Survey {
    title: string;
    description: string;
    responses: number;
    date: number;
    id: string;
    createdAt: string;
}

export function RenderAllSurveys() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSurveys() {
            try {
                const res = await axios.get(`${BACKEND_URL}/survey/bulk`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const result = res.data.surveys;
                setSurveys(result);
            } catch (err) {
                console.error('Error fetching surveys:', err);
                setError('Failed to load surveys');
            } finally {
                setLoading(false);
            }
        }
        fetchSurveys();
    }, []);

    async function deleteSurvey(surveyId: string) {
        try {
            await axios.delete(`${BACKEND_URL}/survey/${surveyId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSurveys(prev => prev.filter(survey => survey.id !== surveyId));
        } catch (err) {
            console.error('Error deleting survey:', err);
            setError('Failed to delete survey');
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-600">Loading surveys...</div>
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Surveys</h1>
            <div className="space-y-4">
                {surveys.map((survey) => (
                    <div 
                        key={survey.id} 
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-semibold">{survey.title}</h2>
                            <button 
                                onClick={() => deleteSurvey(survey.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                        <p className="text-gray-600 mb-2">{survey.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                            <div>Created: {new Date(survey.createdAt).toLocaleDateString()}</div>
                            <div>Responses: {survey.responses}</div>
                        </div>
                    </div>
                ))}
                {surveys.length === 0 && (
                    <div className="text-center text-gray-500">
                        No surveys found
                    </div>
                )}
            </div>
        </div>
    );
}

