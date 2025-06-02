import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

interface Survey {
    title: string;
    description: string;
    responses: number;
    date: number;
    id: string;
    createdAt: string;
}

function useRecentSurveys() {
    const [loading, setLoading] = useState(true);
    const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);

    useEffect(() => {
        async function fetchSurveys() {
            try {
                const res = await axios.get(`${BACKEND_URL}/survey/bulk`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const allSurveys: Survey[] = res.data.surveys;
                const sorted = allSurveys
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5);
                setRecentSurveys(sorted);
            } catch (error) {
                console.error('Error fetching surveys:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSurveys();
    }, []);

    return { loading, recentSurveys };
}

export function Card4() {
    const { loading, recentSurveys } = useRecentSurveys();

    if (loading) {
        return (
            <div className="text-gray-500">
                Loading Surveys...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {recentSurveys.map((survey) => (
                <div 
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition" 
                    key={survey.id}
                >
                    <h3 className="text-lg font-bold">
                        {survey.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {survey.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Created at: {new Date(survey.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
