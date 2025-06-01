import {BACKEND_URL} from "../config/index"
import{useState,useEffect} from "react"
import axios from 'axios'
type Option=string
interface Question{
    questionText:string,
    options:Option[]
}
export function CreateSurveys(){
const [questions,setQuestions]=useState<Question[]>([{
    questionText:'',options:["",""]
}])
const [title,setTitle]=useState('')
const [description,setDescription]=useState('')
function AddQuestions(){
    setQuestions(prev=>[...prev,{questionText:'',options:['']}])
}
function AddOptions(questionIndex:number){
setQuestions(prev=>{
    const updated=[...prev]
    updated[questionIndex].options.push('')
        return updated
})

}


    return <div> 
        {
            questions.map((q,questionIndex)=>(
                <div className=""></div>
            ))
        }
    </div>
}
