import axios from 'axios';

const api = axios.create({
  baseURL: 'https://codingcontests-backend.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// attach token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// // src/services/api.js
// import axios from 'axios';

// const token = localStorage.getItem("token");

// const api = axios.create({
//   baseURL: 'https://codingcontests-backend.onrender.com', // your backend base URL
//   // baseURL: 'https://dcode-backend-h68l.onrender.com/api',
//   withCredentials: true, // required for sending cookies/auth headers
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'Authorization': `Bearer ${token}`  
//   }
// });

// export default api;
