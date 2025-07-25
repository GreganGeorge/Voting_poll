import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [logic,setLogic]=useState('login');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const navigate=useNavigate();
    const handleSubmit=async()=>{
        const state=logic==='login'?'login':'signup';
        if(!email || !password || (logic==='signup' && password!==confirmPassword)){
            toast.error("Please fill fields properly");
            return;
        }
        try{
            const response=await fetch(`http://localhost:8080/api/${state}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({email,password}),
            });
            const data=await response.json();
            if(response.ok){
                toast.success(`${state==='login'?'Logged in':'Account Created'}`);
                if(state==='login'){
                    localStorage.setItem("token",data.token)
                    navigate("/polls");
                }
            }
            else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='flex flex-col gap-4 w-full max-w-sm p-6 border rounded-2xl shadow-lg bg-white'>
            <h1 className='text-4xl font-bold text-center text-blue-900 mb-6'>{logic==='login'?"Login":"Sign Up"}</h1>
            <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email' className='p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400'/>
            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' className='p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400'/>
            {logic==='signup' && <input type='password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder='Confirm Password' className='p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400'/>}
            <div className='relative w-full h-12'>
                <button onClick={handleSubmit} className='absolute left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium text-[18px]'>{logic==='login'?"Login":"Sign Up"}</button>
                <p onClick={()=>setLogic(logic==='login'?'signup':'login')} className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer hover:underline text-[15px]">{logic==='login'?'Register Now':'Login'}</p>
            </div>
        </div>
    </div>
  )
}

export default Login