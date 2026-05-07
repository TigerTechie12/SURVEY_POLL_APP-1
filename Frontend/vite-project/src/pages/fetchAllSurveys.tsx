import { BACKEND_URL } from "../config/index"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

interface Survey {
  title: string
  responses: number
  date: number
  id: string
  createdAt: string
}

export function RenderAllSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await axios.get(`${BACKEND_URL}/survey/bulk`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setSurveys(res.data.surveys as Survey[])
      } catch (err) {
        setError('Failed to load surveys')
      } finally {
        setLoading(false)
      }
    }
    fetchSurveys()
  }, [])

  async function deleteSurvey(surveyId: string) {
    try {
      await axios.delete(`${BACKEND_URL}/survey/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setSurveys(prev => prev.filter(survey => survey.id !== surveyId))
    } catch (err) {
      setError('Failed to delete survey')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading surveys...</div>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">All Surveys</h1>
            <p className="text-gray-500 text-sm mt-1">
              {surveys.length} survey{surveys.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={() => navigate('/surveys/create')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
          >
            <span className="font-bold">+</span>
            New Survey
          </button>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No surveys yet</p>
            <p className="text-sm mt-1">Create your first survey to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {surveys.map(survey => (
              <div
                key={survey.id}
                onClick={() => navigate(`/surveys/${survey.id}`)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-200 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{survey.title}</h2>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
                    <span>{survey.responses} responses</span>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteSurvey(survey.id) }}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
