import axios from 'axios'
import { setAccessToken, logout } from '../app/authSlice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// store is injected after creation to avoid circular imports
let _store = null

export const injectStore = (s) => {
  _store = s
}

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token))
  failedQueue = []
}

axiosInstance.interceptors.request.use((config) => {
  const token = _store?.getState().auth.accessToken
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(original)
        })
      }
      original._retry = true
      isRefreshing = true
      try {
        const res = await axiosInstance.post('/users/refresh-token')
        const newToken = res.data.data.accessToken
        if (_store) _store.dispatch(setAccessToken(newToken))
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        processQueue(null, newToken)
        original.headers['Authorization'] = `Bearer ${newToken}`
        return axiosInstance(original)
      } catch (err) {
        processQueue(err, null)
        if (_store) _store.dispatch(logout())
        window.location.replace('/login')
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance;
