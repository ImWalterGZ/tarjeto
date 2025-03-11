import axios from "axios";

// Simple, straightforward configuration
const apiClient = axios.create({
  baseURL: "http://localhost:5050",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple logging to see what's happening
apiClient.interceptors.request.use((config) => {
  console.log("🚀 Request URL:", config.baseURL + config.url);
  return config;
});

export default apiClient;
