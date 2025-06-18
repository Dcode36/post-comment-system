import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9000/api', // adjust if backend is hosted
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
