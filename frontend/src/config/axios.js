import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Ensure cookies are sent with requests
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// List of auth-related endpoints that need the /auth prefix
const AUTH_ENDPOINTS = [
  "/login",
  "/signup",
  "/logout",
  "/check-auth",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/setup-profile",
];

// Request interceptor to log the full URL and handle auth routes
apiClient.interceptors.request.use(
  (config) => {
    // Add /api prefix if not present
    if (!config.url.startsWith("/api")) {
      config.url = `/api${config.url}`;
    }

    // Log request details
    console.log("Axios Request Config:", {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    // Network errors
    if (!error.response) {
      console.error("Network Error Details:", {
        message: error.message,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          headers: error.config?.headers,
          withCredentials: error.config?.withCredentials,
        },
      });
      return Promise.reject({
        message: "Network Error - Please check your connection and try again",
        originalError: error,
      });
    }

    // Server errors
    console.error("Axios Error Details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
      },
    });

    const errorMessage = error.response?.data?.message || error.message;
    console.error("API Error:", errorMessage);
    return Promise.reject(error);
  }
);

export default apiClient;
