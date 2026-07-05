import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ngo_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue = []

function processQueue(error, token = null) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('ngo_refresh_token')
      if (!refreshToken) {
        logoutAndRedirect()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken })
        localStorage.setItem('ngo_access_token', data.accessToken)
        processQueue(null, data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        logoutAndRedirect()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function logoutAndRedirect() {
  localStorage.removeItem('ngo_access_token')
  localStorage.removeItem('ngo_refresh_token')
  localStorage.removeItem('ngo_user')
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export default api
