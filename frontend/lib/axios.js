import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    withCredentials: true,
});

// Add default headers
axiosInstance.defaults.headers.common['Accept'] = 'application/json';

export default axiosInstance;