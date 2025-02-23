import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api" ||"http://172.20.10.13:3001,",
    withCredentials: true,
});

export default axiosInstance;