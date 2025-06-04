import {useState,useEffect} from 'react'
import axios from 'axios'
import {BACKEND_URL} from '../config/index'
import { useNavigate } from 'react-router-dom'

interface Survey {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    responses?: number;
}

export function Card3(){
    const [query, setQuery] = useState('')
    const [result, setResult] = useState<Survey[]>([])
    const navigate = useNavigate()

    async function EventOnPressingKey(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key === "Enter" && query.trim() !== ""){
            try {
                const res = await axios.get<Survey[]>(`${BACKEND_URL}/surveys/search?title=${query}`)
                setResult(res.data)
            }
            catch(err) {
                console.error("Search failed", err)
                setResult([])
            }
        }
    }
   
    return (
        <div>
            <input 
                type='text' 
                onKeyDown={EventOnPressingKey} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                value={query}
                className="w-full border-gray-300 border-2 p-2 rounded-xl mt-6" 
                placeholder='Search surveys by title'
            />
      
            {result.length > 0 && (
                <ul className='mt-4 bg-white shadow-md rounded-md max-w-md mx-auto'>
                    {result.map((survey) => (
                        <li 
                            key={survey.id} 
                            className="p-2 border-b hover:bg-gray-100 cursor-pointer" 
                            onClick={() => navigate(`/survey/${survey.id}`)}
                        >
                            {survey.title}
                        </li>
                    ))}
                </ul>
            )}
            <div className="font-bold text-2xl ml-1 mt-6">Recent Surveys</div>
        </div>
    )
}

