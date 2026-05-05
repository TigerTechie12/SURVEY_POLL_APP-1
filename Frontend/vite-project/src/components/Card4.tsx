import { useState, useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '@/config'
import { useNavigate } from 'react-router-dom'

interface Survey {
  title: string
  description: string
  responses: number
  date: number
  id: string
  createdAt: string
}

function useRecentSurveys() {
  const [loading, setLoading] = useState(true)
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([])

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await axios.get(`${BACKEND_URL}/survey/bulk`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const allSurveys: Survey[] = res.data.surveys
        const sorted = allSurveys
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
        setRecentSurveys(sorted)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    fetchSurveys()
  }, [])

  return { loading, recentSurveys }
}

export function Card4() {
  const { loading, recentSurveys } = useRecentSurveys()
  const navigate = useNavigate()

  if (loading) {
    return <div className="text-gray-400 text-sm py-4">Loading surveys...</div>
  }

  if (recentSurveys.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-base font-medium">No surveys yet</p>
        <p className="text-sm mt-1">Create your first survey to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {recentSurveys.map(survey => (
        <div
          key={survey.id}
          onClick={() => navigate(`/surveys/${survey.id}`)}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-200 transition cursor-pointer"
        >
          <h3 className="text-base font-semibold text-gray-900">{survey.title}</h3>
          {survey.description && (
            <p className="text-sm text-gray-500 mt-1">{survey.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
            <span>{survey.responses} responses</span>
          </div>
        </div>
      ))}
    </div>
  )
}
