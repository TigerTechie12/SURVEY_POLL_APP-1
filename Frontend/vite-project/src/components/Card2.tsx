export function Card2(){
    return <div className="border-gray-300 border-b-2">
        <div className="mt-4 ml-1  text-2xl mb-3 font-semibold">Welcome to the Survey App</div>
        <div className="ml-1">Create your own surveys or participate in exisiting ones</div>
        <div className="mb-4 mt-6 ml-1">This application allows you to:
    Create surveys with multiple questions and options
    Vote in surveys created by others
    View detailed results of surveys
    Manage your own surveys</div>
    <button className="flex items-center gap-2 bg-black mb-4 ml-1 text-white px-4 py-2 rounded mt-4 hover:bg-gray-800">
   
      <span className="font-semibold">Get Started</span>
    </button>
    </div>
}