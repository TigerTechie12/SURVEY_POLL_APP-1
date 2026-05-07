import { useNavigate } from 'react-router-dom'

export function Card1() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || ''
  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  function signOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/signin')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer"
        >
          <h1 className="text-xl font-bold text-indigo-600">SurveyApp</h1>
          <p className="text-xs text-gray-400 mt-0.5">Create & Participate in Surveys</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/surveys/create')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
          >
            <span className="text-base leading-none">+</span>
            Create Survey
          </button>
          <button
            onClick={signOut}
            className="text-gray-500 hover:text-gray-700 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
          <div
            onClick={() => navigate('/')}
            title={userName}
            className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors shrink-0"
          >
            {initials || '?'}
          </div>
        </div>
      </div>
    </nav>
  )
}
