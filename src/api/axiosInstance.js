import axios from 'axios';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true, // Optional, if you're using cookies
});

// Add a response interceptor
// axiosInstance.interceptors.response.use(
//   response => response, // Pass through successful responses
//   error => {
//     if (error.response && error.response.status === 401 && !error.config.url.includes('/api/auth/login')) {
//       // Remove token on 401 Unauthorized
//       localStorage.removeItem("token");

//       // Optionally redirect to login
//       window.location.href = "/auth/login";
//     }

//     // Always reject the error so calling code can handle it too
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
