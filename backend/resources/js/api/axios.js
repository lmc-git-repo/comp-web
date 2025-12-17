import axios from "axios";

// Detect API URL automatically
const API_BASE = window.location.origin + "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
});

// Allow cookies (CSRF + sessions)
api.defaults.withCredentials = true;

// Attach CSRF token if present
const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute("content");

if (csrfToken) {
  api.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
}

// Required for Laravel AJAX detection
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Attach auth token + DO NOT BREAK FILE UPLOADS
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ CRITICAL: let Axios handle multipart boundaries
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default api;