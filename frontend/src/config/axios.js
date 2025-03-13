import axios from "axios";

// Simple, straightforward configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to log requests and ensure auth token is included
apiClient.interceptors.request.use((config) => {
  console.log("🚀 Request URL:", config.baseURL + config.url);

  // The withCredentials option will automatically include cookies,
  // which is where our authentication token is stored
  return config;
});

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log(
        "Authentication error:",
        error.response?.data?.message || "Unauthorized"
      );
      // You might want to redirect to login or refresh the token here
    }
    return Promise.reject(error);
  }
);

export default apiClient;
