import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest } from '../services/graphqlClient'
import { NUS_LOCATIONS } from '../constants/locations'
import { CATEGORIES } from '../constants/categories'

const CREATE_REQUEST = `
  mutation CreateRequest($input: CreateRequestInput!) {
    createRequest(input: $input) {
      id
      title
    }
  }
`

export default function CreateRequestPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    condition: 'Any',
    category: 'Electronics',
    location: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await graphqlRequest(CREATE_REQUEST, {
        input: {
          title: formData.title,
          description: formData.description || null,
          budget: parseFloat(formData.budget),
          condition: formData.condition,
          category: formData.category,
          location: formData.location || null,
        },
      })

      alert('Request created successfully!')
      navigate('/want-to-buy')
    } catch (error) {
      console.error('Failed to create request:', error)
      alert(error.message || 'Error creating request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Request an Item</h2>
        <p className="text-gray-500 mt-2">Let the community know what you are looking for.</p>
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
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
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
            <button type="button" onClick={() => navigate('/want-to-buy')} className="btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.budget}
              className="btn-primary px-8"
            >
              {isSubmitting ? 'Posting...' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
