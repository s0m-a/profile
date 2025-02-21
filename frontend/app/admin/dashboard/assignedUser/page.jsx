'use client'
import withRole from "../../../middleware/withRole"
import axiosInstance from "../../../../lib/axios"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Key, Loader} from 'lucide-react';

const AssignedUser = () => {
  const [users, setUsers] = useState( [])
  const [loading, setLoading] = useState(false)
  const [manager, setManager] = useState( [])
  const [formData, setFormData] = useState({
          userId: '',
          managerId: ''
      })
  useEffect(() => {
    const fetchAssignedUser = async () => {
      try {
        const response = await axiosInstance.get('admin/dashboard/usersWithManager');
        setUsers(response.data.data)
      } catch (error) {
        const errorMessage = error.response?.data?.message
        console.error(errorMessage || "An error occurred");
        toast.error(errorMessage)
      }
    };
  
    fetchAssignedUser();
  }, []);

  const AssignedManager = async () => {
    try {
        const response = await axiosInstance.post("admin/dashboard/assignManager", formData)
        console.log(response)
        toast.success(response?.data?.message)
    } catch (error) {
        const errorMessage = response?.data?.message;
        toast.error(errorMessage)
        console.log(errorMessage)
    }
}

const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData( (prevData) => ({...prevData, [name]: value}));
}

  return (
    <main className="flex flex-col h-screen">


<div className="h-1/3 md:h-1/2 bg-gray-200 p-2 overflow-y-auto">
  {users.length === 0 ? (
    <p className="text-center text-gray-600">No users found</p>
  ) : (
    <div className="p-4">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-customWarm p-6 rounded-lg shadow-lg flex flex-col gap-2"
          >
            <p className="text-md font-semibold">{user.name}</p>
            <p className="text-gray-700">userId: <span className="text-gray-400">{user.id}</span></p>

            <div className="mt-2">
              <p className="text-md font-semibold">Manager:</p>
              {user.manager?.id ? (
                <div className="ml-4 text-gray-800">
                  <p>Manager Name: {user.manager.name}</p>
                  <p>Manager ID: {user.manager.id}</p>
                </div>
              ) : (
                <p className="ml-4 text-gray-500">No manager assigned</p>
              )}
            </div>

            <p className="font-medium capitalize mt-2">Role: {user.role}</p>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  {/* Second section takes the other 50% */}
  <div className="">
    <h2 className="text-center uppercase font-bold mt-4  ">assign manager</h2>
    <form onSubmit={AssignedManager} 
            className='flex flex-col justify-center m-10 lg:w-[50%] lg:mx-auto'>

                <div className="flex items-center border-b border-gray-500 mb-4">
                <Key className="w-5 h-5 text-gray-500 mr-2" /> 
                <input name="userId" 
                placeholder="Enter User Id"
                onChange={handleChange}
                className="p-4 flex-1 border-none outline-none"
                />
                </div>

                <div className="flex items-center border-b border-gray-500 mb-4">
                <Key className="w-5 h-5 text-gray-500 mr-2" /> 
                <input name="managerId" 
                placeholder="Enter manager Id"
                onChange={handleChange}
                className="p-4 flex-1 border-none outline-none"
                />
                </div>
                <button 
                type="submit" 
                disabled={loading}
                className='bg-customBrown flex justify-center p-4 my-4 text-white capitalize font-bold text-md shadow-lg hover:bg-customBrownDark'> 
                {loading? 
                (<> <Loader className="w-5 h-5  animate-spin" /> Loading...</>)
                :(<> login</>)}
               </button>
    </form>
  </div>

    </main>
  )
}

export default AssignedUser
