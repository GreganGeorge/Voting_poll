import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CompletedPolls = () => {
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
  useEffect(()=>{
    getAllPolls();
  },[])
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-blue-700 font-medium text-[28px] mt-8 mb-4'>Completed Polls</h1>
      {polls.filter(poll=>new Date(poll.expiresAt) < currentTime).map((poll)=>(
        <div className='border p-4 mb-6 rounded-lg shadow-md w-full max-w-xl'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>{poll.question}</h2>
          <ul className='flex flex-col gap-2'>
            {poll.options.map((option)=>(
              <li className={`flex justify-between items-center border p-2 rounded-md ${poll.selectedOption.includes(option)?'bg-blue-500 text-white':''}`}>
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

export default CompletedPolls