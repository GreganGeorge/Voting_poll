import React from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate=useNavigate();
    const handleLogout=()=>{
        localStorage.removeItem("token");
        navigate("/");
        toast.success("Logged out successfully");
    }
  return (
    <nav className='flex justify-between bg-blue-800 text-white px-6 py-4 items-center'>
        <Link to='/polls'><div className='text-white text-2xl font-bold'>
            Polls
        </div></Link>
        <ul className='flex space-x-6 text-lg'>
            <Link to='/completedpolls'><li className='cursor-pointer hover:scale-105 duration-100 hover:text-gray-200'>Completed Polls</li></Link>
            <Link to='/createpoll'><li className='cursor-pointer hover:scale-105 duration-100 hover:text-gray-200'>Create Poll</li></Link>
            <li onClick={handleLogout} className='cursor-pointer hover:scale-105 duration-100 hover:text-gray-200'>Log Out</li> 
        </ul>
    </nav>
  )
}

export default Navbar