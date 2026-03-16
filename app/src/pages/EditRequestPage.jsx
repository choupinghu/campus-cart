import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { graphqlRequest } from '../services/graphqlClient'
import { NUS_LOCATIONS } from '../constants/locations'

const GET_REQUEST = `
  query GetRequest($id: ID!) {
    request(id: $id) {
      id
      title
      description
      budget
      condition
      location
      category {
        name
      }
    }
  }
`

const UPDATE_REQUEST = `
  mutation UpdateRequest($id: ID!, $input: UpdateRequestInput!) {
    updateRequest(id: $id, input: $input) {
      id
      title
    }
  }
`

export default function EditRequestPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    condition: 'Any',
    category: 'Electronics',
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadRequest() {
      try {
        const data = await graphqlRequest(GET_REQUEST, { id })
        if (data?.request) {
          const req = data.request
          setFormData({
            title: req.title,
            description: req.description || '',
            budget: req.budget.toString(),
            condition: req.condition || 'Any',
            category: req.category?.name || 'Electronics',
            location: req.location || '',
          })
        }
      } catch (error) {
        console.error('Failed to load request:', error)
        alert('Could not load request details.')
        navigate('/my-listings')
      } finally {
        setLoading(false)
      }
    }
    loadRequest()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await graphqlRequest(UPDATE_REQUEST, {
        id,
        input: {
          title: formData.title,
          description: formData.description || null,
          budget: parseFloat(formData.budget),
          condition: formData.condition,
          category: formData.category,
          location: formData.location || null,
        },
      })

      alert('Request updated successfully!')
      navigate('/my-listings')
    } catch (error) {
      console.error('Failed to update request:', error)
      alert(error.message || 'Error updating request.')
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
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Buying Request</h2>
        <p className="text-gray-500 mt-2">Update the details of what you are looking for.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>

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
                  placeholder="e.g. Calculus: Early Transcendentals 9th Ed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    required
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desired Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="Any">Any Condition</option>
                    <option value="New">Brand New</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Meetup Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select a location</option>
                  {NUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
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
                  placeholder="Tell potential sellers what exactly you need..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/my-listings')} className="btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.budget}
              className="btn-primary px-8"
            >
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
