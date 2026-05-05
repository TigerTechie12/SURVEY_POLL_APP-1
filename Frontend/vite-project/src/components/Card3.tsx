import { useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../config/index'
import { useNavigate } from 'react-router-dom'

interface Survey {
  id: string
  title: string
  description?: string
  createdAt: string
  responses?: number
}

export function Card3() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<Survey[]>([])
  const navigate = useNavigate()

  async function EventOnPressingKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim() !== '') {
      try {
        const res = await axios.get<Survey[]>(`${BACKEND_URL}/surveys/search?title=${query}`)
        setResult(res.data)
      } catch (err) {
        setResult([])
      }
    }
  }

  return (
    <div>
      <input
        type="text"
        onKeyDown={EventOnPressingKey}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        value={query}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Search surveys by title and press Enter..."
      />

      {result.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          {result.map(survey => (
            <div
              key={survey.id}
              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0 text-sm text-gray-700 transition-colors"
              onClick={() => navigate(`/surveys/${survey.id}`)}
            >
              {survey.title}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Recent Surveys</h2>
    </div>
  )
}
