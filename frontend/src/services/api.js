// src/services/api.js
import axios from 'axios';

const token = localStorage.getItem("token");

const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // your backend base URL
  baseURL: 'https://dcode-backend-h68l.onrender.com/api',
  withCredentials: true, // required for sending cookies/auth headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`  
  }
});

export default api;
