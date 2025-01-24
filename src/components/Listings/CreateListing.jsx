import { useState } from 'react'
import axios from '../../api/axios'
import { useNavigate } from 'react-router-dom'

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrls: [],
  })
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleImageUrlsChange = (e) => {
    const urls = e.target.value.split(',').map((url) => url.trim())
    setFormData((prev) => ({ ...prev, imageUrls: urls }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
  
    const { title, description, price, imageUrls } = formData

    console.log('Payload being sent:', { title, description, price, imageUrls })
  
    if (!title || !description || !price) {
      setError('All fields except images are required.')
      setIsLoading(false)
      return
    }

    try {
      await axios.post('/listings', { title, description, price, imageUrls })
      navigate('/')
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to create listing.')
      } else if (err.request) {
        setError('Network error. Please try again.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="create-listing-container">
      <h2>Create a New Listing</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the listing title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter the listing description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter the price"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrls">Image URLs (comma-separated)</label>
          <input
            type="text"
            id="imageUrls"
            name="imageUrls"
            value={formData.imageUrls.join(', ')}
            onChange={handleImageUrlsChange}

            // onChange={(e) =>
            //   setFormData((prev) => ({
            //     ...prev,
            //     imageUrls: e.target.value.split(',').map((url) => url.trim()),
            //   }))
            // }
            placeholder="Enter image URLs, separated by commas"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}
export default CreateListing