"use client";
import { useUserStore } from "../../context/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function withRole(WrappedComponent, allowedRoles) {
  return function ProtectedComponent(props) {
    const { user, checkingAuth } = useUserStore();
    const router = useRouter();

    useEffect(() => {
      if (!checkingAuth) {
        if (!user) {
          router.replace("/auth/login"); // Redirect if not logged in
        } else if (!allowedRoles.includes(user.role)) {
          toast.error("Access Denied");
          router.replace("/"); // Redirect if role is unauthorized
        }
      }
    }, [checkingAuth, user, router]);

    if (checkingAuth) {
      return <p>Loading, please wait...</p>; // Show loading screen while checking auth
    }

    if (!user || !allowedRoles.includes(user.role)) {
      return null; // Prevent unauthorized users from seeing content
    }

    return <WrappedComponent {...props} />;
  };
}
