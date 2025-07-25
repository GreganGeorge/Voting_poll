import React, { useState } from 'react'
import toast from 'react-hot-toast';

const CreatePoll = () => {
  const [options,setOptions]=useState(['']);
  const [question,setQuestion]=useState('');
  const addOption=()=>{
    setOptions([...options,'']);
  }
  const handleOption=(index,value)=>{
    const newOptions=[...options];
    newOptions[index]=value;
    setOptions(newOptions);
  }
  const handleSubmit=async()=>{
    if(!question.trim()){
      toast.error("Question is required");
      return;
    }
    const filteredOptions=options.map((o)=>o.trim()).filter(o=>o!=='');
    if(filteredOptions.length<2){
      toast.error("At least two options are required");
      return;
    }
    try{
      const token=localStorage.getItem("token");
      const response=await fetch("http://localhost:8080/api/polls",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({question,options})
      });
      const data=await response.text();
      if(response.ok){
        toast.success("Poll created successfully");
        setQuestion('');
        setOptions(['']);
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message);
    }
  }
  return (
    <div className='flex flex-col justify-center items-center mt-28'>
    <div className='flex flex-col justify-center items-center max-w-lg w-full px-6'>
        <h1 className='text-3xl text-blue-900 font-bold p-4'>Create Poll</h1>
        <div className='flex flex-col justify-between gap-2 w-full'>
          <input type='text' onChange={(e)=>setQuestion(e.target.value)} className='border border-blue-900 p-2 w-full rounded-md focus:outline-none focus:ring-blue-400 focus:ring-2' placeholder='Enter Question'/>
          {options.map((option,index)=>(
            <input type="text" value={option} onChange={(e)=>handleOption(index,e.target.value)} placeholder={`Option ${index+1}`} className='border border-blue-900 p-2 w-full rounded-md focus:outline-none focus:ring-blue-400 focus:ring-2'/>
          ))}
        </div>
        <div className='flex justify-between gap-2 p-4'>
            <button onClick={addOption} className='border border-blue-900 bg-blue-50 p-2 rounded-md text-blue-900 font-bold hover:bg-blue-800 duration-150 hover:text-white'>Add Option</button>
            <button onClick={handleSubmit} className='border border-blue-900 bg-blue-50 p-2 rounded-md text-blue-900 font-bold hover:bg-blue-800 duration-150 hover:text-white'>Create Poll</button>
        </div>
    </div>
    </div>
  )
}

export default CreatePoll