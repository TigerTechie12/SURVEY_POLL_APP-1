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

  async function handleSearch(value: string) {
    setQuery(value)
    if (value.trim() === '') {
      setResult([])
      return
    }
    try {
      const res = await axios.get<Survey[]>(`${BACKEND_URL}/survey/search?title=${value}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setResult(res.data)
    } catch (err) {
      setResult([])
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        value={query}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Search surveys by title..."
      />

      {query.trim() !== '' && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {result.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">No surveys found</div>
          ) : (
            result.map(survey => (
              <div
                key={survey.id}
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0 text-sm text-gray-700 transition-colors"
                onClick={() => { setQuery(''); setResult([]); navigate(`/surveys/${survey.id}`) }}
              >
                {survey.title}
              </div>
            ))
          )}
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Recent Surveys</h2>
    </div>
  )
}
