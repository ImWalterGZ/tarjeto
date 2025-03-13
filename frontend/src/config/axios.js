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
  console.log("🚀 Request Config:", {
    url: config.url,
    baseURL: config.baseURL,
    fullURL: config.baseURL + config.url,
    method: config.method,
    headers: config.headers,
    withCredentials: config.withCredentials,
  });

  // The withCredentials option will automatically include cookies,
  // which is where our authentication token is stored
  return config;
});

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error("❌ Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers,
        withCredentials: error.config?.withCredentials,
      },
    });

    if (error.response?.status === 401) {
      console.log(
        "Authentication error:",
        error.response?.data?.message || "Unauthorized"
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
