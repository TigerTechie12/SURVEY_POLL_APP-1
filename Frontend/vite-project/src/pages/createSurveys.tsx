import { BACKEND_URL } from "../config/index"
import { useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

type Option = string

interface Question {
  questionText: string
  options: Option[]
}

export function CreateSurveys() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([{
    questionText: '',
    options: ['', '']
  }])
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function DeleteQuestions(questionIndex: number) {
    setQuestions(prev => prev.filter((_, index) => index !== questionIndex))
  }

  function DeleteOptions(questionIndex: number, optIndex: number) {
    const copy = [...questions]
    copy[questionIndex] = {
      ...copy[questionIndex],
      options: copy[questionIndex].options.filter((_, index) => index !== optIndex)
    }
    setQuestions(copy)
  }

  function AddQuestions() {
    setQuestions(prev => [...prev, { questionText: '', options: [''] }])
  }

  function AddOptions(questionIndex: number) {
    setQuestions(prev => {
      const updated = [...prev]
      updated[questionIndex].options.push('')
      return updated
    })
  }

  async function submitResponse() {
    try {
      setIsSubmitting(true)
      await axios.post(
        `${BACKEND_URL}/survey`,
        {
          title,
          questions: questions.map(q => ({
            title: q.questionText,
            options: q.options
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      navigate('/surveys/bulk')
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create Survey</h1>
            <p className="text-gray-500 text-sm mt-1">Build your survey with questions and options</p>
          </div>
          <button
            onClick={AddQuestions}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
          >
            <span className="font-bold text-base leading-none">+</span>
            Add Question
          </button>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Survey Title</label>
            <input
              type="text"
              placeholder="e.g. Customer Satisfaction Survey"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {questions.map((q, questionIndex) => (
            <div key={questionIndex} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Question {questionIndex + 1}
                </span>
                <button
                  onClick={() => DeleteQuestions(questionIndex)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Question Text</label>
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const updated = [...questions]
                    updated[questionIndex].questionText = e.target.value
                    setQuestions(updated)
                  }}
                  placeholder="Enter your question..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Answer Options</label>
                  <button
                    onClick={() => AddOptions(questionIndex)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex gap-2 items-center">
                      <span className="text-gray-400 text-xs w-5 text-right shrink-0">{optIndex + 1}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updated = [...questions]
                          updated[questionIndex].options[optIndex] = e.target.value
                          setQuestions(updated)
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => DeleteOptions(questionIndex, optIndex)}
                        className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={submitResponse}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Publish Survey'}
          </button>
        </div>
      </div>
    </div>
  )
}
