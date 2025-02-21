import { useState, useEffect } from "react"
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { ArrowRight, Loader, Lock, Mail, User } from 'lucide-react';




const ProfileCard = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get("user/veiwProfile");
          setUser(response.data.data);
          setFormData(response.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          const errordata = error?.response?.data?.message || "Error getting profile";
          toast.error(errordata);
        }
      };
      fetchUser();
    }, []);
  
    const toggleEdit = () => setIsEditing((prev) => !prev);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const editProfile = async (e) => {
      e.preventDefault();
      try {
        const response = await axiosInstance.put("user/updateProfile", formData);
        setUser(formData); // Update local user data
        toast.success("Profile updated successfully!");
        console.log(response)
        toggleEdit();
      } catch (error) {
        const errorMessage = error.response?.data?.message
        toast.error(errorMessage || "Failed to update profile.");
        console.log(error)
      }
    };
  
    if (!user) return <p>Loading...</p>;
  
    return (
      <div className="w-[90%] m-auto lg:w-[40%] bg-customYellow text-gray-700 p-6 capitalize flex flex-col shadow-lg mt-10">
        <h1 className="text-center uppercase antialiased font-bold text-xl mb-10">User Profile</h1>
  
        {isEditing ? (
          <form onSubmit={editProfile} className="space-y-4 text-gray-500">
            <div className="flex items-center border-b-2 border-customBrownDark p-2">
              <User className="w-5 h-5 mr-2" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md outline-none"
              />
            </div>
  
            <div className="flex items-center border-b-2 border-customBrownDark p-2">
              <User className="w-5 h-5 mr-2" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md outline-none"
              />
            </div>
  
            <div className="flex items-center border-b-2 border-customBrownDark p-2">
              <Mail className="w-5 h-5 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md outline-none"
              />
            </div>
  
            <div className="flex gap-4">
              <button type="submit" className="bg-customGreen text-white px-4 py-2 rounded-md">
                Save
              </button>
              <button type="button" onClick={toggleEdit} className="bg-gray-100 px-4 py-2 rounded-md text-gray-600">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-start items-center border-dotted border-b-2 border-customBrownDark m-6">
              <User className="w-5 h-5 mr-2" />
              <span>First name:</span>
              <p className="ml-2">{user.firstName}</p>
            </div>
  
            <div className="flex justify-start items-center border-dotted border-b-2 border-customBrownDark m-6">
              <User className="w-5 h-5 mr-2" />
              <span>Last name:</span>
              <p className="ml-2">{user.lastName}</p>
            </div>
  
            <div className="flex justify-start items-center border-dotted border-b-2 border-customBrownDark m-6">
              <Mail className="w-5 h-5 mr-2" />
              <span>Email:</span>
              <p className="ml-2">{user.email}</p>
            </div>
  
            <button
              onClick={toggleEdit}
              className="capitalize bg-customGreen text-white font-semibold py-4 px-4 rounded-md w-[45%] hover:bg-white hover:border hover:border-customGreen hover:text-gray-500 transition duration-200 my-4 shadow-md lg:m-4"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    );
  };
  
  export default ProfileCard;