import axios from 'axios'
import config from './config'

const API = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error('No auth token found in localStorage')
    } else {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Axios request error:', error)
    return Promise.reject(error)
  }
)

export default API
