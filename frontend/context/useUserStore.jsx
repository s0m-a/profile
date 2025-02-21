import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-hot-toast";


export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async (userData, router) => {
		set({ loading: true });

		try {
			const res = await axiosInstance.post("/auth/register",userData );
			set({ user: res.data, loading: false });
      router.push("./login")
		} catch (error) {
			set({ loading: false });
      console.log(error)
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error(errorMessage);
		}
	},
	login: async (email, password, router) => {
		set({ loading: true });

		try {
			const res = await axiosInstance.post("/auth/login", {email, password});
			set({ user: res.data, loading: false });
      router.push('/')
		} catch (error) {
			set({ loading: false });
      console.log(error)
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},

	logout: async (router) => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axiosInstance.get("/auth/profile");
      if (!response.data) {
        throw new Error("User data is missing");}
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

  GoogleRegister: async ()=>{
    set({loading: true});
    try {
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"; // Redirects to backend route
		window.location.href = `${apiBaseUrl}/auth/google`;
    } catch (error) {
      console.error(error.response?.data?.message || "Registration failed!");
    }
    set({ loading: false });
  },

  GithubRegister: async () => {
    set({ loading: true });
    try {
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ||"http://localhost:3001/api"
        window.location.href = `${apiBaseUrl}/auth/github`;
      console.log(window.location.href);
    } catch (error) {
      console.error(error.response?.data?.message || "Registration failed!");
    }
    set({ loading: false });
  }
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}


);