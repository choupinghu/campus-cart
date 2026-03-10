import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ImageUploader from '../components/ui/ImageUploader'

export default function EditListingPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'New',
    category: 'Electronics',
    imageUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch existing listing data
  useEffect(() => {
    async function fetchListing() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/listings/${id}`)
        if (res.ok) {
          const listing = await res.json()
          setFormData({
            title: listing.title || '',
            description: listing.description || '',
            price: listing.price?.toString() || '',
            condition: listing.condition || 'New',
            category: listing.category?.name || 'Electronics',
            imageUrl: listing.imageUrl || '',
          })
        } else {
          alert('Listing not found.')
          navigate('/my-listings')
        }
      } catch (err) {
        console.error('Failed to fetch listing:', err)
        alert('Error loading listing.')
        navigate('/my-listings')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadComplete = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${baseUrl}/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update listing')
      }

      alert('Listing updated successfully!')
      navigate('/my-listings')
    } catch (error) {
      console.error('Failed to update listing:', error)
      alert(error.message || 'Error updating listing.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nus-blue"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Listing</h2>
        <p className="text-gray-500 mt-2">Update your listing details or re-upload a photo.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 border-b border-gray-100 pb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">1. Photos</h3>

          {/* Show current image */}
          {formData.imageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Current photo:</p>
              <img
                src={formData.imageUrl}
                alt="Current listing"
                className="w-40 h-40 object-cover rounded-xl border border-gray-200"
              />
            </div>
          )}

          <p className="text-sm text-gray-500 mb-3">
            Upload a new photo to replace the current one:
          </p>
          <ImageUploader onUploadComplete={handleUploadComplete} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">2. Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. iPhone 13 Pro - 128GB"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Describe the item, any defaults, why you're selling..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/my-listings')}
              className="py-2.5 px-6 rounded-xl font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.price}
              className="py-2.5 px-8 rounded-xl font-medium text-white bg-nus-blue hover:bg-nus-blue-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
