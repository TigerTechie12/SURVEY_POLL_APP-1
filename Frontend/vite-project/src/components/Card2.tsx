import { useNavigate } from 'react-router-dom'

export function Card2() {
  const navigate = useNavigate()

  const features = [
    'Create surveys with multiple questions and options',
    'Vote in surveys created by others',
    'View detailed results of surveys',
    'Manage your own surveys',
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SurveyApp</h2>
      <p className="text-gray-500 text-sm mb-6">Create your own surveys or participate in existing ones.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {features.map(feature => (
          <div key={feature} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="text-indigo-500 mt-0.5 shrink-0">✓</span>
            {feature}
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/surveys/bulk')}
        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
      >
        Browse Surveys
      </button>
    </div>
  )
}
