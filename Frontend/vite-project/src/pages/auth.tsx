import {Link, useNavigate} from 'react-router-dom'

export function Auth({type}:{type: "signup" | "signin"}){
const navigate=useNavigate()

return <div>
        <div className=" flex justify-center font-bold text-lg">Survey App</div>
        <div className="space-y-4">
        <div className="flex flex-col justify-center mt-4 items-center">

            <div className="font-semibold text-left">{type=='signup'?"Name" : null }</div>
          {type=="signup"?<input type='text' className="w-1/2 flex justify-center align-middle pt-1 pb-1 items-center border-gray-400 rounded-xl border-2" placeholder=" John"></input>:null} </div>
            
             <div className="flex flex-col items-center">
             <div className="font-semibold flex items-start">Email</div>
             <input type="text" placeholder=" xyz@protonmail.com" className="w-1/2 flex justify-center pt-1 pb-1  border-gray-400 rounded-xl border-2" /></div>       
            
             <div className="flex flex-col items-center">
                
             <div className="font-semibold">Password</div>
             <input type="text" placeholder=" *********" className="w-1/2 flex justify-center pt-1 pb-1  border-gray-400 rounded-xl border-2" /></div>
            

            <div className="flex flex-row justify-center">
            <button onClick={()=>{navigate('/')}} className=" bg-gradient-to-r from-green-400 via-green-500 to-green-600 w-10xl ml-55 rounded-xl pl-4 pr-4 pt-1 pb-1 text-white hover:bg-gradient-to-br focus:ring-green-300 dark:focus:ring-green-800">
      {type=='signin'?'Signin':'Signup'}
      </button>
      <div className='ml-1 mt-1 text-sm text-gray-400'>{type=="signup"?'Have an account already?':"Don't have an account?"}</div> <Link className='text-sm mt-1 ml-1 underline' to={type=='signup' ? "/signin" : '/signup'}>{type=='signup'?'Signin':'Signup'}</Link>  
      </div>
    </div>

</div>
}