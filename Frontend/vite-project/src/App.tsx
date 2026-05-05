import './App.css'
import { type ReactElement } from 'react'
import { Auth } from "./pages/auth"
import { Dashboard } from "./pages/dashboard"
import { RenderAllSurveys } from "./pages/fetchAllSurveys"
import { CreateSurveys } from "./pages/createSurveys"
import { RenderSurvey } from "./pages/fetchById"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/signin" replace />
  return children
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Auth type='signup' />} />
          <Route path='/signin' element={<Auth type='signin' />} />
          <Route path='/' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/surveys/bulk' element={<ProtectedRoute><RenderAllSurveys /></ProtectedRoute>} />
          <Route path='/surveys/create' element={<ProtectedRoute><CreateSurveys /></ProtectedRoute>} />
          <Route path='/surveys/:id' element={<ProtectedRoute><RenderSurvey /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
