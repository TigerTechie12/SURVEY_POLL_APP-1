import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Auth} from "./pages/auth"
import {Dashboard} from "./pages/dashboard"
import {RenderAllSurveys} from "./pages/fetchAllSurveys"
import {CreateSurveys} from "./pages/createSurveys"
import{BrowserRouter,Route,Routes} from 'react-router-dom'
function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Auth type='signup'></Auth>}></Route>
        <Route path='/signin' element={<Auth type='signin'></Auth>}></Route>
        <Route path='/' element={<Dashboard></Dashboard>}></Route>    
        <Route path='/surveys/bulk' element={<RenderAllSurveys></RenderAllSurveys>}></Route>
        <Route path='/surveys/create' element={<CreateSurveys></CreateSurveys>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
