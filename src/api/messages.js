import axios from './axios'

const API_BASE_URL = 'http://localhost:3000/api'

// Get messages for a listing
export const getListingMessages = async (listingId) => {
  const token = localStorage.getItem('authToken') 
  const response = await axios.get(`${API_BASE_URL}/listing/${listingId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// Get user's inbox (Future API)
export const getInboxMessages = async () => {
  const token = localStorage.getItem('authToken')
  const response = await axios.get(`${API_BASE_URL}/messages/inbox`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// Send a message
export const sendMessage = async (listingId, content) => {
  const token = localStorage.getItem('authToken')
  const response = await axios.post(
    `${API_BASE_URL}/listing/${listingId}/send`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

// Edit a message (Future API)
export const editMessage = async (messageId, content) => {
  const token = localStorage.getItem('authToken')
  const response = await axios.put(
    `${API_BASE_URL}/messages/${messageId}`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}

// Delete a message (Future API)
export const deleteMessage = async (messageId) => {
  const token = localStorage.getItem('authToken')
  const response = await axios.delete(`${API_BASE_URL}/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
