import {BACKEND_URL} from "../config/index"
import{useState,useEffect} from "react"
import axios from 'axios'
export function CreateSurveys(){
    return <div className="flex flex-col">
        <div className="font-bold">Create New Survey</div>
        <div>Design your survey with multiple questions & options</div>
        <div className="font-semibold">Survey Title *</div>
        <input type='text' placeholder="e.g.,Customer Satisfaction Survey" className="rounded"></input>
       <div className="font-semibold">Description *</div>
       <input type="text" className="rounded" placeholder="Briefly describe what this survey is about and why you are conducting it"  />
<div className="flex flex-row justify-between ">
    <div className="font-bold">Survey Questions</div>
    <button className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded-2xl hover:bg-green-800">
   <span className="text-lg font-bold">＋</span>
      <span className="font-semibold">Add Question</span>
    </button>
</div>

    </div>
}
