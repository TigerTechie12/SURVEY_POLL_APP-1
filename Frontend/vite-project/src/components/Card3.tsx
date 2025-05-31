import {useState,useEffect} from 'react'
import axios from 'axios'
import {BACKEND_URL} from '../config/index'
export function Card3(){
    const [query,setQuery]=useState('')
    const [results,setResults]=useState([])
    
   setTimeout(()=>{useEffect(()=>{axios.get(`${BACKEND_URL}/survey/bulk/search?query=${query}`)},[query])},8000) 
    return <div>
         <input type='text' onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setQuery(e.target.value)} className="w-full  border-gray-300 border-2 p-2 rounded-xl mt-6" placeholder='Search surveys by title or description'></input>
        <div className="font-bold text-2xl ml-1 mt-6">Recent Surveys</div>
       
    </div>
}

