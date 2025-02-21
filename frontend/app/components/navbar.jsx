"use client"
//navbar.jsx
import React from 'react'
import Link from 'next/link'
import { useUserStore } from '../../context/useUserStore';
import {  usePathname, useRouter } from "next/navigation";
import axiosInstance from '../../lib/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user,logout, loading } = useUserStore();
  const pathname = usePathname();
  const router = useRouter()

const logoutUser = async ()=>{
  try {
    await logout(router);
  } catch (error) {
    console.error("Logout failed:", error);
    const errorMessage = error.response?.data?.messsage || "login failed!";
    toast.error( errorMessage);   
  }
}

  return (
    <div className='bg-customGreenDark text-black p-10 rounded flex justify-between'>
        <Link href={'../'}>
      <h1 className='text-white uppercase text-2xl antialiased font-extrabold'>
        pro
        <span className='text-customYellow'>file</span>
        </h1>
        </Link>

        <nav className="flex items-center space-x-4">
                {user ? (
                    <>
                        {user.role === "admin" && <Link href="/admin/dashboard"
                        className="text-white capitalize border p-2 rounded-lg hover:bg-white hover:text-gray-500 hover:border-customGreen shadow-md"
                        ><button className="btn">Admin dashboard</button></Link>}

                        {user.role === "manager" && <Link href="/manager/dashboard"
                        className="text-white capitalize border p-2 rounded-lg hover:bg-white hover:text-gray-500 hover:border-customGreen shadow-md"
                        ><button className="btn">Manager dashboard</button></Link>}



                        <button  onClick={logoutUser}
                        className="text-white capitalize border p-2 rounded-lg hover:bg-white hover:text-gray-500 hover:border-customGreen shadow-md"
                        >Logout</button>
                    </>
                ) : (
                  pathname !== "/auth/login" && pathname !== "/auth/register" && (
                    <Link href="/auth/login">
                      <button className="btn">Login</button>
                    </Link>
                ))}
            </nav>

    </div>
  )
}

export default Navbar
