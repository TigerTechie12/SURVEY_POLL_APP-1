import { BACKEND_URL } from "../config/index"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from 'axios'

interface Survey {
  title: string
  responses: number
  date: number
  id: string
  createdAt: string
  questions: {
    id: string
    title: string
    options: {
      id: string
      text: string
    }[]
  }[]
}

export function RenderSurvey() {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const { id: surveyId } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [questionEdit, setQuestionEdit] = useState<string>('')
  const [optionEdit, setOptionEdit] = useState<string>('')

  useEffect(() => {
    async function fetchSurvey() {
      if (!surveyId) {
        setError('Survey ID is missing')
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(`${BACKEND_URL}/survey/${surveyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setSurvey(res.data.survey)
      } catch (err) {
        setError('Failed to load survey')
      } finally {
        setLoading(false)
      }
    }
    fetchSurvey()
  }, [surveyId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading survey...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Survey not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-3"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
            <span>{survey.responses} responses</span>
          </div>
        </div>

        <div className="space-y-6">
          {survey.questions.map((q, qi) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="mb-4">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Question {qi + 1}
                </span>
                <p className="text-gray-900 font-medium mt-3">{q.title}</p>
              </div>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Edit question text..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestionEdit(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={() => { async () => { await axios.put(`${BACKEND_URL}/survey/${surveyId}/question/${q.id}`, { questionEdit }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }) } }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shrink-0"
                >
                  Update
                </button>
              </div>

              <div className="space-y-2">
                {q.options.map((o, oi) => (
                  <div key={o.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-400 font-medium w-5 shrink-0">{oi + 1}.</span>
                    <span className="text-sm text-gray-700 flex-1">{o.text}</span>
                    <input
                      type="text"
                      placeholder="Edit option..."
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOptionEdit(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-36"
                    />
                    <button
                      onClick={() => { async () => { await axios.put(`${BACKEND_URL}/survey/${surveyId}/question/${q.id}/option/${o.id}`, { optionEdit }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }) } }}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shrink-0"
                    >
                      Update
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
