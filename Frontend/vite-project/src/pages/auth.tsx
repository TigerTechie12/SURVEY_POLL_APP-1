import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../config/index'

export function Auth({ type }: { type: "signup" | "signin" }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const endpoint = type === 'signup' ? '/user/signup' : '/user/signin'
      const body = type === 'signup' ? { name, email, password } : { email, password }
      const res = await axios.post(`${BACKEND_URL}${endpoint}`, body)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userName', res.data.user?.name || '')
      localStorage.setItem('userEmail', res.data.user?.email || '')
      localStorage.setItem('userId', String(res.data.user?.id || ''))
      navigate('/')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">SurveyApp</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {type === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          {type === 'signup' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="xyz@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Please wait...' : type === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            {type === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              to={type === 'signup' ? '/signin' : '/signup'}
              className="text-indigo-600 font-medium hover:underline"
            >
              {type === 'signup' ? 'Sign In' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
