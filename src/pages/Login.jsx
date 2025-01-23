import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../api/AuthContext'
import axios from '../api/axios'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { setUser, setAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleReload = () => {
    window.location.reload()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append('username', username)
    form.append('password', password)

    try {
      const response = await fetch('https://the-garage-marketplace-fbea5251146d.herokuapp.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to login')
      }

      const data = await response.json()
      const { token, refreshToken, user } = data

      localStorage.setItem('authToken', token)
      localStorage.setItem('refreshToken', refreshToken)

      setUser(user)
      setAuthenticated(true)

      navigate('/')
      handleReload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login