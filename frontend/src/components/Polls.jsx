import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Polls = () => {
  const [polls,setPolls]=useState([]);
  const navigate=useNavigate();
  const currentTime=new Date();
  const getAllPolls=async()=>{
    try{
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/getAllPolls", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if(response.status===401){
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        const data=await response.json();
        setPolls(data);
        if (!response.ok) {
            throw new Error("Failed to fetch polls");
        }
    }catch(error){
        toast.error("Error fetching data");
    }
  }
  const handleOption=async(id,option)=>{
    const token=localStorage.getItem("token");
    try{
    const response=await fetch("http://localhost:8080/api/vote",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/json",
      },
      body:JSON.stringify({pollId:id,selectedOption:option}),
    });
    const result=await response.json();
    if(response.ok){
      toast.success(result.message || "Vote updated");
      getAllPolls();
    }
    else{
      toast.error(result.message || "Vote failed");
    }
  }catch(error){
    toast.error("Error submitting vote");
  }
  }
  const getRemainingTime=(expiresAt)=>{
    const expires = new Date(expiresAt);
    const diff = expires - currentTime;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  useEffect(()=>{
    getAllPolls();
  },[])
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-blue-700 font-medium text-[28px] mt-8 mb-4'>Available Polls</h1>
      {polls.filter(poll=>new Date(poll.expiresAt) > currentTime).map((poll)=>(
        <div className='border p-4 mb-6 rounded-lg shadow-md w-full max-w-xl'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>{poll.question}</h2>
          <p className='mb-2 flex justify-end'><span className='text-gray-700 font-normal'>Expires in</span><span className='font-bold ml-1'>{getRemainingTime(poll.expiresAt)}</span></p>
          <ul className='flex flex-col gap-2'>
            {poll.options.map((option)=>(
              <li className={`flex justify-between items-center border p-2 rounded-md cursor-pointer ${poll.selectedOption.includes(option)?'bg-blue-500 text-white':'hover:bg-blue-50 transition'}`}
              onClick={()=>handleOption(poll.id,option)}>
                <span>{option}</span>
                <span className={`text-sm ${poll.selectedOption.includes(option)? 'text-white':''}`}>{poll.optionVoteCounts[option]} votes</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default Polls