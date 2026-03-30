import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../components/ui/ImageUploader'
import AiAutoFillButton from '../components/ui/AiAutoFillButton'
import { graphqlRequest } from '../services/graphqlClient'
import { NUS_LOCATIONS } from '../constants/locations'
import { CATEGORIES } from '../constants/categories'

const CREATE_LISTING = `
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
    }
  }
`

export default function CreateListingPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'New',
    category: 'Electronics',
    location: '',
    imageUrl: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [showUploadToast, setShowUploadToast] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadComplete = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url || '' }))
    if (url) {
      setShowUploadToast(true)
      setTimeout(() => setShowUploadToast(false), 5000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await graphqlRequest(CREATE_LISTING, {
        input: {
          title: formData.title,
          description: formData.description || null,
          price: parseFloat(formData.price),
          condition: formData.condition,
          category: formData.category,
          location: formData.location || null,
          imageUrl: formData.imageUrl || null,
        },
      })

      alert('Listing created successfully!')
      navigate('/')
    } catch (error) {
      console.error('Failed to create listing:', error)
      alert(error.message || 'Error creating listing.')
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
            <p className="font-bold text-lg text-gray-900 tracking-tight leading-tight px-1">Success</p>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Image uploaded successfully.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sell an Item</h2>
        <p className="text-gray-500 mt-2">Upload a photo to get started.</p>
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
                Please wait while we generate a title, description, and suggested price.
              </p>
            </div>
          </div>
        )}

        <div className={`mb-8 border-b border-gray-100 pb-8 transition-opacity duration-300 ${isAiLoading ? 'opacity-30' : ''}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">1. Photos</h3>
          <ImageUploader onUploadComplete={handleUploadComplete} />


          {/* AI Auto-Fill — appears after image upload */}
          {formData.imageUrl && (
            <div className="mt-4">
              <AiAutoFillButton
                imageUrl={formData.imageUrl}
                disabled={!formData.imageUrl || isAiLoading}
                onLoadingChange={setIsAiLoading}
                onSuggest={(suggestions) => {
                  setFormData((prev) => ({
                    ...prev,
                    title: suggestions.title || prev.title,
                    description: suggestions.description || prev.description,
                    price: suggestions.suggestedPrice
                      ? String(suggestions.suggestedPrice)
                      : prev.price,
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
              <h3 className="text-lg font-medium text-gray-900 mb-4 tracking-tight">2. Details</h3>

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
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meetup Location
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
                    placeholder="Describe the item, any defaults, why you're selling..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/')} className="btn-outline">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.imageUrl || !formData.title || !formData.price}
                className="btn-primary px-8"
              >
                {isSubmitting ? 'Creating...' : 'List Item'}
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
