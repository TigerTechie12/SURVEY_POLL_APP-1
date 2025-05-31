import {BACKEND_URL} from "../config/index"
import {useState,useEffect} from 'react'
import axios from 'axios'
interface Survey{
    "title": string,
"description": string,
"responses" : number,
"date":number,
"id":string,
"createdAt":string
}
export function RenderAllSurveys(){ 


    const [surveys,setSurveys]=useState<Survey[]>([])
    const [loading,setLoading]=useState(true)
useEffect(()=>{
async function fetch(){
    const res= await axios.get(`${BACKEND_URL}/surveys`)
    const result=res.data.surveys
    setSurveys(result)
    setLoading(false)
}
 fetch()

},[])

if(loading){
   return <div>loading.....</div>
}

return <div>
   {surveys.map((s)=>(
    <div key={s.id} className="flex flex-col border-2 mb-2 mt-2">
     
     <div>{s.title}</div>
     <div>{s.description}</div>
     <div>{s.date}</div>
     <div>{s.createdAt}</div>
     <div>{s.responses}</div>
</div>
   ))}
</div>
}

