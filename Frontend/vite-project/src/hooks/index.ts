import {BACKEND_URL} from '../config'
import axios from 'axios'
import {useState,useEffect} from 'react'

interface Survey{
"title": String,
"description": String,
"responses" : Number,
"date":Number,
"id":String,
"createdAt":String
}


export function Survey({id}:{id:number}){
const [loading,setLoading]=useState(true)
const [survey,setSurvey]=useState<Survey[]>([])
useEffect(()=>{
axios.get(`${BACKEND_URL}/survey/${id}`,{headers:{Authorization:localStorage.getItem("token")}}).then(res=>{setSurvey(res.data.survey)
    setLoading(false)
})
},[id])
return{loading,survey}
}

export function Surveys(){
    const [loading,setLoading]=useState(true)
    const [surveys,setSurveys]=useState<Survey[]>([])
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/survey/bulk`,{headers:{Authorization:localStorage.getItem("token")}}).then(res=>{setSurveys(res.data.surveys)
            setLoading(false)
        })
    },[])
    return{loading,surveys}
}
