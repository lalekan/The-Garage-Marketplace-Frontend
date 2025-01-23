import { createContext, useState, useEffect } from 'react'
import { CheckSession, RefreshToken } from './Auth'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null // Return null if parsing fails or user not found
    } catch (error) {
      console.warn('Invalid user data in localStorage:', error)
      return null // Return null if JSON.parse fails
    }
  })

  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem('authToken') // Check for authToken presence
    } catch (error) {
      console.warn('Error reading authToken from localStorage:', error)
      return false
    }
  })

  const [loading, setLoading] = useState(true)

  const checkToken = async () => {
    const token = localStorage.getItem('authToken')

    if (!token) {
      console.warn('No token found in localStorage.')
      setAuthenticated(false)
      setLoading(false)
      return
    }

    try {
      const userData = await CheckSession(token)
      setUser(userData)
      setAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      console.error('Error in CheckSession:', err.message)

      try {
        const newToken = await RefreshToken()
        const userData = await CheckSession(newToken)
        setUser(userData)
        setAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (refreshErr) {
        console.error('Error refreshing token:', refreshErr.message)
        setUser(null)
        setAuthenticated(false)
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, authenticated, setAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
