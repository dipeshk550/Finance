import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ngo_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ngo_access_token')
    if (!token) {
      setLoading(false)
      return
    }
    authService
      .me()
      .then(({ data }) => {
        setUser(data.user)
        localStorage.setItem('ngo_user', JSON.stringify(data.user))
      })
      .catch(() => {
        localStorage.removeItem('ngo_access_token')
        localStorage.removeItem('ngo_refresh_token')
        localStorage.removeItem('ngo_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { data } = await authService.login(email, password)
    localStorage.setItem('ngo_access_token', data.accessToken)
    localStorage.setItem('ngo_refresh_token', data.refreshToken)
    localStorage.setItem('ngo_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('ngo_access_token')
    localStorage.removeItem('ngo_refresh_token')
    localStorage.removeItem('ngo_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
