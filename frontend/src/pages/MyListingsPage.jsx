import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/auth'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function MyListingsPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return

    async function fetchMyListings() {
      setLoading(true)
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/listings?sellerId=${session.user.id}`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setListings(data)
        }
      } catch (err) {
        console.error('Failed to fetch listings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyListings()
  }, [session?.user?.id])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/listings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setListings((prev) => prev.filter((l) => l.id !== id))
      } else {
        alert('Failed to delete listing.')
      }
    } catch (err) {
      console.error('Failed to delete listing:', err)
      alert('Error deleting listing.')
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
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Listings</h2>
          <p className="text-gray-500 mt-1">
            {listings.length} active listing{listings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/create-listing')}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium">You haven&apos;t listed any items yet.</p>
          <p className="text-sm mt-1">Click &quot;New Listing&quot; to sell your first item!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex gap-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <div className="w-28 h-28 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                    📷
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{listing.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {listing.description || 'No description'}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-lg font-bold text-nus-blue">
                    S${listing.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full uppercase">
                    {listing.condition || 'N/A'}
                  </span>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    {listing.category?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/edit-listing/${listing.id}`)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
