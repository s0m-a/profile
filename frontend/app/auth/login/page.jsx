'use client'
import { ArrowRight, Loader, Lock, Mail, User } from 'lucide-react';
import axiosInstance from "../../../lib/axios";
import {toast} from 'react-hot-toast';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import React from 'react'
import { useUserStore } from '../../../context/useUserStore';


const Login = () => {
    const router = useRouter();
    const[formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { login, loading, GoogleRegister, GithubRegister  } = useUserStore();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData( (prevData) => ({...prevData, [name]: value}));
        
    }


     const loginUser = async (e)=>{
        e.preventDefault();
        try {
          await login(formData.email, formData.password, router);
        } catch (error) {
          console.error("Login failed:", error);
          const errorMessage = error.response?.data?.messsage || "login failed!";
          toast.error( errorMessage);   
        }
     }

  return (
    <div>
              <div className='flex flex-col justify-center mt-10'>
            <h2 className='text-center uppercase mt-10'> log in </h2>
            <form onSubmit={loginUser} 
            className='flex flex-col justify-center m-10 lg:w-[50%] lg:mx-auto'>

                <div className="flex items-center border-b border-gray-500 mb-4">
                <Mail className="w-5 h-5 text-gray-500 mr-2" /> {/* User icon */}
                <input name="email" 
                placeholder="Email"
                onChange={handleChange}
                className="p-4 flex-1 border-none outline-none"
                />
                </div>

                <div className="flex items-center border-b border-gray-500 mb-4">
                <Lock className="w-5 h-5 text-gray-500 mr-2" /> {/* User icon */}
               <input name="password" 
                placeholder="Password"
                onChange={handleChange}
                className="p-4 flex-1 border-none outline-none"
                />
                </div>
                <h3>don't have an account?  <Link href='./register'>register</Link></h3>
               
              
                <button 
                type="submit" 
                disabled={loading}
                className='bg-customBrown flex justify-center p-4 my-4 text-white capitalize font-bold text-md shadow-lg hover:bg-customBrownDark'> 
                {loading? 
                (<> <Loader className="w-5 h-5  animate-spin" /> Loading...</>)
                :(<> login</>)}
               </button>
            </form>
            <div className='flex flex-col justify-center  mx-10 lg:mx-auto'>
          <div className="flex items-center mb-4">
            <span className="border-b border-gray-300 flex-grow mr-2"></span>
            <span className="text-md ">or</span>
            <span className="border-b border-gray-300 flex-grow ml-2"></span>
          </div>

         <div className="flex justify-center flex-col lg:flex-row">
           <button 
            onClick={GoogleRegister} 
            className="bg-customGreen text-white font-semibold py-4 px-4 rounded-md 
            hover:bg-white hover:border hover:border-customGreen hover:text-gray-500 
            transition duration-200 my-4 shadow-md lg:m-4">
            Connect with Google
           </button>
           <button 
            onClick={GithubRegister} 
            className="bg-customGreen text-white font-semibold py-4 px-4 rounded-md 
            hover:bg-white hover:border hover:border-customGreen hover:text-gray-500 
            transition duration-200 my-4  shadow-md lg:m-4 ">
            Connect with Github
           </button>
    </div>

</div>
        </div>
    </div>
  )
}

export default Login
