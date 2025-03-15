import axios from "axios";

// Determine environment
const isProduction =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

const environment = isProduction ? "production" : "development";

const BASE_URL = isProduction
  ? "https://api.tarjeto.app"
  : import.meta.env.VITE_API_URL || "http://localhost:5050";

console.log("Axios Initialization Details:");
console.log("- Current hostname:", window.location.hostname);
console.log("- Window origin:", window.location.origin);
console.log("- Environment:", environment);
console.log("- API URL:", BASE_URL);
console.log("- Document origin:", document.location.origin);
console.log("- Document referrer:", document.referrer);

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Credentials": "true",
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

    // Add the Referer header
    config.headers.Referer = window.location.origin;

    // Add detailed request logging
    console.log("\n=== Axios Request Details ===");
    console.log("1. Request Configuration:");
    console.log("- Full URL:", config.baseURL + config.url);
    console.log("- Method:", config.method);
    console.log("- Headers:", JSON.stringify(config.headers, null, 2));
    console.log("- WithCredentials:", config.withCredentials);
    console.log("\n2. Environment Context:");
    console.log("- Window Origin:", window.location.origin);
    console.log("- Base URL:", config.baseURL);
    console.log("- Environment:", environment);
    console.log("- Production Mode:", isProduction);
    console.log(
      "\n3. Request Body:",
      config.data ? JSON.stringify(config.data, null, 2) : "No body"
    );
    console.log("========================");

    return config;
  },
  (error) => {
    console.error("\n=== Axios Request Error ===");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    console.error("========================");
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("\n=== Axios Response Success ===");
    console.log("1. Response Overview:");
    console.log("- Status:", response.status);
    console.log("- Status Text:", response.statusText);
    console.log("\n2. Headers Received:");
    console.log(JSON.stringify(response.headers, null, 2));
    console.log("\n3. Response Data:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("========================");
    return response;
  },
  (error) => {
    console.error("\n=== Axios Response Error ===");

    // Network errors (no response received)
    if (!error.response) {
      console.error("1. Network Error:");
      console.error("- Message:", error.message);
      console.error("- Type: No response received from server");
      console.error("\n2. Request Configuration:");
      console.error("- URL:", error.config?.url);
      console.error("- Base URL:", error.config?.baseURL);
      console.error("- Method:", error.config?.method);
      console.error(
        "- Headers:",
        JSON.stringify(error.config?.headers, null, 2)
      );
      console.error("- WithCredentials:", error.config?.withCredentials);
    } else {
      // Server errors (response received)
      console.error("1. Server Error:");
      console.error("- Status:", error.response.status);
      console.error("- Status Text:", error.response.statusText);
      console.error("\n2. Response Headers:");
      console.error(JSON.stringify(error.response.headers, null, 2));
      console.error("\n3. Response Data:");
      console.error(JSON.stringify(error.response.data, null, 2));
      console.error("\n4. Request Configuration:");
      console.error("- URL:", error.config?.url);
      console.error("- Method:", error.config?.method);
      console.error(
        "- Headers Sent:",
        JSON.stringify(error.config?.headers, null, 2)
      );
    }

    console.error("========================");
    return Promise.reject(error);
  }
);

export default apiClient;
