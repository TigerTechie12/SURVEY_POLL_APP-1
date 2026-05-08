import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Card1() {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const userName = localStorage.getItem('userName') || ''
  const userEmail = localStorage.getItem('userEmail') || ''
  const initials = userName
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  function signOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    navigate('/signin')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div onClick={() => navigate('/')} className="cursor-pointer">
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
          <div className="relative">
            <div
              onClick={() => setDropdownOpen(prev => !prev)}
              className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors shrink-0"
            >
              {initials || '?'}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userName || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{userEmail}</p>
                </div>
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-b-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
