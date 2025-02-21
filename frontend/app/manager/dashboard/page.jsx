"use client"
import axiosInstance from "../../../lib/axios.js"
import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const ManagerDashboard = () => {

    const [users, setUsers] = useState( [])

    
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await axiosInstance.get('manager/dashboard/allUsers');
          setUsers(response.data.data)
        } catch (error) {
          const errorMessage = error.response?.data?.message
          console.error(errorMessage || "An error occurred");
          toast.error(errorMessage)
        }
      };
    
      fetchUserProfile();
    }, []);

    const handleDelete = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
      
        try {
            
          const response = await axiosInstance.delete("manager/dashboard/deleteUser", {
            data: { userId }, // Ensure data is sent properly
          });
      
          toast.success(response.data.message || "User deleted successfully");
      
          // Remove user from state to update UI
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (error) {
          console.error("Error deleting user:", error);
          toast.error(error.response?.data?.message || "Server error, unable to delete user");
        }
      };
  return (
    <div>
          {users.length === 0 ? (
        <p>No users found</p>
      ) : (
<div className="bg-gray-200 p-4 m-4">
  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {users.map((user) => (
      <li key={user.id} className="bg-customWarm p-6 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
        <p className="text-gray-700">{user.email}</p>
        <p className="font-medium capitalize">Role: {user.role}</p>
        <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
      </li>
      
    ))}
  </ul>
</div>

      )}
    </div>
  )
}

export default ManagerDashboard
