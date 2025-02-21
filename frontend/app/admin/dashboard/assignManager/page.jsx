'use client'
import withRole from "../../../middleware/withRole"
import axiosInstance from "../../../../lib/axios"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const AssignedManager = () => {
  const [manager, setManager] = useState( [])
  useEffect(() => {
    const fetchAssignedManager = async () => {
      try {
        const response = await axiosInstance.get('admin/dashboard/usersWithManager');
        console.log(response)
        setManager(response.data.data)
      } catch (error) {
        const errorMessage = error.response?.data?.message
        console.error(errorMessage || "An error occurred");
        toast.error(errorMessage)
      }
    };
  
    fetchAssignedManager();
  }, []);
  return (
    <div>
      {manager.length === 0 ? (
        <p>No users found</p>
      ) : (
<div className="bg-gray-200 p-4 m-4">
  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {manager.map((user) => (
      <li key={user.id} className="bg-customWarm p-6 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-gray-700">{user.email}</p>
        {user.manager.id? (<p>manager: {user.manager.name}</p>):(<p>manager: {user.manager}</p>)}
        <p className="font-medium capitalize">Role: {user.role}</p>
      </li>
    ))}
  </ul>
</div>

      )}
    </div>
  )
}

export default AssignedManager