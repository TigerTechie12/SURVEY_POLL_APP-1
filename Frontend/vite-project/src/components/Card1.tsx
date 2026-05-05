import { useNavigate } from 'react-router-dom'

export function Card1() {
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-600">SurveyApp</h1>
          <p className="text-xs text-gray-400 mt-0.5">Create & Participate in Surveys</p>
        </div>
        <button
          onClick={() => navigate('/surveys/create')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
        >
          <span className="text-base leading-none">+</span>
          Create Survey
        </button>
      </div>
    </nav>
  )
}
