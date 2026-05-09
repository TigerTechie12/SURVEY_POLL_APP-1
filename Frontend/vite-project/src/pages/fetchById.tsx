import { BACKEND_URL } from "../config/index"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from 'axios'

interface Option {
  id: number
  text: string
  votes: number
}

interface Question {
  id: number
  title: string
  options: Option[]
}

interface Survey {
  id: number
  title: string
  createdAt: string
  userId: number
  questions: Question[]
}

export function RenderSurvey() {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const { id: surveyId } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const currentUserId = parseInt(localStorage.getItem('userId') || '0')

  useEffect(() => {
    async function fetchSurvey() {
      if (!surveyId) { setError('Survey ID is missing'); setLoading(false); return }
      try {
        const res = await axios.get(`${BACKEND_URL}/survey/${surveyId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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

  async function deleteSurvey() {
    if (!window.confirm('Delete this survey? This cannot be undone.')) return
    try {
      await axios.delete(`${BACKEND_URL}/survey/${surveyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      navigate('/surveys')
    } catch {
      setError('Failed to delete survey')
    }
  }

  async function submitVotes() {
    try {
      await Promise.all(
        Object.values(votes).map(optionId =>
          axios.post(`${BACKEND_URL}/survey/${surveyId}/vote`, { optionId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        )
      )
      setSubmitted(true)
      const res = await axios.get(`${BACKEND_URL}/survey/${surveyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setSurvey(res.data.survey)
    } catch {
      setError('Failed to submit votes')
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-gray-400 text-sm">Loading survey...</div></div>
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-red-500 text-sm">{error}</div></div>
  if (!survey) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-gray-400 text-sm">Survey not found</div></div>

  const isCreator = currentUserId === survey.userId
  const totalVotesForQuestion = (q: Question) => q.options.reduce((sum, o) => sum + o.votes, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-3">
            ← Back to Dashboard
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
              <p className="text-sm text-gray-400 mt-1">
                Created {new Date(survey.createdAt).toLocaleDateString()} · {isCreator ? 'Your survey' : 'Vote below'}
              </p>
            </div>
            {isCreator && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/surveys/${surveyId}/edit`)}
                  className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-indigo-200"
                >
                  Edit
                </button>
                <button
                  onClick={deleteSurvey}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {survey.questions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-gray-900 font-medium mb-4">{q.title}</p>

              {isCreator ? (
                <div className="space-y-2">
                  {q.options.map(o => {
                    const total = totalVotesForQuestion(q)
                    const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0
                    return (
                      <div key={o.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{o.text}</span>
                          <span className="text-gray-500 font-medium">{o.votes} votes ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                  <p className="text-xs text-gray-400 mt-2">Total: {totalVotesForQuestion(q)} votes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {submitted ? (
                    q.options.map(o => {
                      const total = totalVotesForQuestion(q)
                      const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0
                      return (
                        <div key={o.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{o.text}</span>
                            <span className="text-gray-500">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    q.options.map(o => (
                      <label key={o.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${votes[q.id] === o.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={o.id}
                          checked={votes[q.id] === o.id}
                          onChange={() => setVotes(prev => ({ ...prev, [q.id]: o.id }))}
                          className="accent-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{o.text}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!isCreator && !submitted && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={submitVotes}
              disabled={Object.keys(votes).length !== survey.questions.length}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Submit Votes
            </button>
          </div>
        )}

        {submitted && (
          <p className="mt-6 text-center text-sm text-green-600 font-medium">Your votes have been submitted!</p>
        )}
      </div>
    </div>
  )
}
