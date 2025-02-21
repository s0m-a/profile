import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true
});



//state mamnagement for token
let isRefreshing = false; //refreshing flag
let pendingRequests = [];

const onRefreshed = (token) =>{
    pendingRequests.forEach( (callback) => callback(token))
    pendingRequests = []; // Clear pending requests after resolving
}

const addPendingRequest = (callback) => {
    pendingRequests.push(callback);
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error)=> {
        const originalRequest = error.config;
        if(error.response && error.response?.status === 401){

            if(!isRefreshing){
                isRefreshing = true

            try {
                //refresh access token
                const response = await axios.get("http://localhost:3001/api/auth/refresh",{
                    withCredentials: true, // Sends the refresh token stored in the cookie
                });
                const newAccessToken = response.data.accessToken;
                // Set the new token in the axios instance
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                //call pending requests with new token
                onRefreshed(newAccessToken);
                isRefreshing = false;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed", refreshError);
                isRefreshing = false;
                window.location.href = "/auth/login"; // Redirect to login if refresh fails
            }}else{
                    // If a refresh is in progress, return a promise that resolves when the token is refreshed
                    return new Promise((resolve, reject) => {
                    addPendingRequest((newToken) => {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(axiosInstance(originalRequest));
                });
            });
           }
            }
        return Promise.reject(error);
    }
);
export default axiosInstance;