import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // or full URL like 'https://your-api.com/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

// If using auth token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetcher = url => API.get(url).then(res => res.data);

export default API;
