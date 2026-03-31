import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest } from '../services/graphqlClient'
import ImageUploader from '../components/ui/ImageUploader'
import AiAutoFillButton from '../components/ui/AiAutoFillButton'
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
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [showUploadToast, setShowUploadToast] = useState(false)

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
      {/* Upload Success Toast (Below Header with smooth entry/exit) */}
      {showUploadToast && (
        <div
          className="fixed top-24 right-6 z-[100] flex items-center gap-4 p-5 bg-white border-2 border-emerald-500/10 text-gray-900 rounded-2xl shadow-2xl toast-lifecycle-anim"
          style={{ width: 'fit-content', minWidth: '380px' }}
        >
          <div className="bg-emerald-500 p-2.5 rounded-full shadow-inner ring-4 ring-emerald-50">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-gray-900 tracking-tight leading-tight px-1">
              Success
            </p>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Reference uploaded successfully.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Request an Item</h2>
        <p className="text-gray-500 mt-2">Let the community know what you are looking for.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
        {/* AI Loading Overlay (Full Container) */}
        {isAiLoading && (
          <div className="absolute inset-0 z-[100] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-all duration-300">
            <div className="flex flex-col items-center p-10 bg-white shadow-2xl rounded-3xl border border-indigo-50 -mt-10 max-w-sm w-full mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 scale-150 blur-2xl bg-indigo-200/50 rounded-full animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin relative" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center tracking-tight">
                Analyzing your image
              </h3>
              <p className="text-sm text-gray-500 text-center leading-relaxed">
                Please wait while we generate a title, description, and suggested budget.
              </p>
            </div>
          </div>
        )}

        {/* Optional photo upload for AI auto-fill */}
        <div
          className={`mb-8 border-b border-gray-100 pb-8 transition-opacity duration-300 ${isAiLoading ? 'opacity-30' : ''}`}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-1">Photo (Optional)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload a reference photo to auto-fill the form with AI.
          </p>
          <ImageUploader
            onUploadComplete={(url) => {
              setImageUrl(url || '')
              if (url) {
                setShowUploadToast(true)
                setTimeout(() => setShowUploadToast(false), 5000)
              }
            }}
          />

          {imageUrl && (
            <div className="mt-4">
              <AiAutoFillButton
                imageUrl={imageUrl}
                disabled={!imageUrl || isAiLoading}
                onLoadingChange={setIsAiLoading}
                onSuggest={(suggestions) => {
                  setFormData((prev) => ({
                    ...prev,
                    title: suggestions.title || prev.title,
                    description: suggestions.description || prev.description,
                    budget: suggestions.suggestedPrice
                      ? String(suggestions.suggestedPrice)
                      : prev.budget,
                    condition: suggestions.condition || prev.condition,
                    category: suggestions.category || prev.category,
                  }))
                }}
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isSubmitting || isAiLoading} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 tracking-tight">Details</h3>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
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
              <button
                type="button"
                onClick={() => navigate('/want-to-buy')}
                className="btn-outline"
              >
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
          </fieldset>

          <style>{`
            @keyframes toast-lifecycle {
              0% { opacity: 0; transform: translateX(40px); }
              8% { opacity: 1; transform: translateX(0); }
              92% { opacity: 1; transform: translateX(0); }
              100% { opacity: 0; transform: translateX(40px); }
            }
            .toast-lifecycle-anim {
              animation: toast-lifecycle 5s ease-in-out forwards;
            }
          `}</style>
        </form>
      </div>
    </div>
  )
}
