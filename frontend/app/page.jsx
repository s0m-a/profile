'use client'
import UserDashboard from "./dashboard/UserDashboard";
import ManagerDashboard from "./dashboard/managerDashboard";
import AdminProfile from "./admin/page";
import { useEffect } from "react";
import {  Loader} from 'lucide-react';
import { useUserStore } from "../context/useUserStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const router = useRouter();
  useEffect(() => {
    checkAuth();
  }, []);
  useEffect(() => {
    if (!checkingAuth && !user) {
      toast.error("Please log in");
      router.push('auth/login')

    }
  }, [user, checkingAuth]); 
  if (checkingAuth) return <p> <Loader /> loading</p>;

  if (!user) return null; // Prevents rendering errors

  return (
      <div>
          {user.role === "admin" ? <AdminProfile /> :
          user.role === "manager" ? <ManagerDashboard /> :
          <UserDashboard />}
      </div>
  );
}

