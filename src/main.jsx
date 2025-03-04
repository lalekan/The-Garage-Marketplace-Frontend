import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './api/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
)
