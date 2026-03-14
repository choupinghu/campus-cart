import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/auth'
import { graphqlRequest } from '../services/graphqlClient'
import { Pencil, Trash2, Plus } from 'lucide-react'

const GET_MY_LISTINGS = `
  query GetMyListings($sellerId: String!) {
    listings(sellerId: $sellerId) {
      id
      title
      description
      price
      condition
      imageUrl
      category { name }
    }
  }
`

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      message
      id
    }
  }
`

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
        const data = await graphqlRequest(GET_MY_LISTINGS, {
          sellerId: session.user.id,
        })
        setListings(data.listings)
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
      await graphqlRequest(DELETE_LISTING, { id })
      setListings((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error('Failed to delete listing:', err)
      alert(err.message || 'Error deleting listing.')
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
          className="btn-primary"
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
                  <span className="badge-gray">
                    {listing.condition || 'N/A'}
                  </span>
                  <span className="badge-accent">
                    {listing.category?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/edit-listing/${listing.id}`)}
                  className="btn-ghost"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="btn-danger"
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
