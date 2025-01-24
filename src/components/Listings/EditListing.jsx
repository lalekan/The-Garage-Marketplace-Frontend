import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import '../../styles/EditListing.css'

const EditListing = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrls: [], // Handle image URLs
  })
  const [existingImages, setExistingImages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/listings/${id}`)
        const { title, description, price, images } = response.data
        setFormData({ title, description, price, imageUrls: images })
        setExistingImages(images)
      } catch (err) {
        console.error('Error fetching listing:', err.message)
        setError('Unable to load listing details.')
      }
    }
    fetchListing()
  }, [id])

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
    const { title, description, price, imageUrls } = formData

    if (!title || !description || !price) {
      setError('All fields except images are required.')
      return
    }

    const token = localStorage.getItem('authToken')
    if (!token) {
      setError('Unauthorized. Please log in again.')
      return
    }

    try {
      const response = await axios.put(
        `/listings/${id}`,
        { title, description, price, imageUrls }, // Send data directly as JSON
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      )
      navigate('/')
    } catch (err) {
      console.error('Error updating listing:', err.response?.data || err.message)
      setError('Unable to update listing. Please try again.')
    }
  }

  return (
    <div className="edit-listing-page">
      <h1>Edit Listing</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Existing Images:
          <div className="existing-images">
            {existingImages.map((image, index) => (
              <img
                key={index}
                src={image.startsWith('http') ? image : `https://the-garage-marketplace-fbea5251146d.herokuapp.com/${image}`}
                alt="Listing"
                className="existing-image"
              />
            ))}
          </div>
        </label>
        <label>
          Update Image URLs (comma-separated):
          <input
            type="text"
            name="imageUrls"
            value={formData.imageUrls.join(', ')}
            onChange={handleImageUrlsChange}
            placeholder="Enter new image URLs, separated by commas"
          />
        </label>
        <button type="submit">Update Listing</button>
      </form>
    </div>
  )
}

export default EditListing
