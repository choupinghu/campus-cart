import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/auth'
import { graphqlRequest } from '../services/graphqlClient'
import { Pencil, Trash2, Package, ShoppingBag, LayoutDashboard, MapPin } from 'lucide-react'

const GET_MY_ACTIVITY = `
  query GetMyActivity($userId: String!) {
    listings(sellerId: $userId) {
      id
      title
      description
      price
      condition
      location
      imageUrl
      category { name }
    }
    requests(userId: $userId) {
      id
      title
      description
      budget
      condition
      location
      category { name }
    }
  }
`

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`

const DELETE_REQUEST = `
  mutation DeleteRequest($id: ID!) {
    deleteRequest(id: $id) {
      id
    }
  }
`

export default function MyListingsPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const [listings, setListings] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchActivity = useCallback(async () => {
    if (!session?.user?.id) return
    setLoading(true)
    try {
      const data = await graphqlRequest(GET_MY_ACTIVITY, {
        userId: session.user.id,
      })
      setListings(data.listings || [])
      setRequests(data.requests || [])
    } catch (err) {
      console.error('Failed to fetch activity:', err)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) {
      fetchActivity()
    }
  }, [session?.user?.id, fetchActivity])

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return
    try {
      await graphqlRequest(DELETE_LISTING, { id })
      setListings((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error('Failed to delete listing:', err)
      alert(err.message || 'Error deleting listing.')
    }
  }

  const handleDeleteRequest = async (id) => {
    if (!confirm('Are you sure you want to remove this request?')) return
    try {
      await graphqlRequest(DELETE_REQUEST, { id })
      setRequests((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Failed to delete request:', err)
      alert(err.message || 'Error deleting request.')
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
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-nus-blue" />
            My Activity
          </h2>
          <p className="text-gray-500 mt-1 font-medium">
            Manage your items and requests in one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Listings Column ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-nus-blue" />
              Items for Sale
              <span className="text-sm font-bold text-gray-400 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                {listings.length}
              </span>
            </h3>
            <button
              onClick={() => navigate('/create-listing')}
              className="text-xs font-black text-nus-blue hover:underline uppercase tracking-widest"
            >
              + New Listing
            </button>
          </div>

          {listings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
              <p className="text-sm font-bold">No active listings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="card p-4 flex gap-4 hover:shadow-md transition-shadow group border-l-4 border-l-nus-blue"
                >
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                    {l.imageUrl ? (
                      <img src={l.imageUrl} alt={l.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 truncate text-lg">{l.title}</h4>
                    <p className="text-xl font-black text-nus-blue mt-1">S$ {l.price.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge-gray">{l.condition}</span>
                      <span className="badge-blue">{l.category?.name}</span>
                      <div className="w-full flex items-center gap-1 text-[10px] text-gray-400 font-bold mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{l.location || 'Anywhere in NUS'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/edit-listing/${l.id}`)}
                      className="p-2.5 hover:bg-amber-50 rounded-xl text-gray-400 hover:text-nus-orange transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteListing(l.id)}
                      className="p-2.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Requests Column ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-nus-orange" />
              Buying Requests
              <span className="text-sm font-bold text-gray-400 ml-2 bg-amber-50 px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            </h3>
            <button
              onClick={() => navigate('/create-request')}
              className="text-xs font-black text-nus-orange hover:underline uppercase tracking-widest"
            >
              + Post Request
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="p-12 text-center bg-amber-50/30 rounded-3xl border border-dashed border-amber-200 text-amber-900/40">
              <p className="text-sm font-bold">No buying requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="card p-4 flex gap-4 hover:shadow-md transition-shadow border-l-4 border-l-nus-orange"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 truncate text-lg">{r.title}</h4>
                    <p className="text-xl font-black text-nus-orange mt-1">
                      Budget: S$ {r.budget.toFixed(2)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge-gray">{r.condition}</span>
                      <span className="badge-accent">{r.category?.name}</span>
                      <div className="w-full flex items-center gap-1 text-[10px] text-gray-400 font-bold mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{r.location || 'Anywhere in NUS'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/edit-request/${r.id}`)}
                      className="p-2.5 hover:bg-amber-50 rounded-xl text-gray-400 hover:text-nus-orange transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(r.id)}
                      className="p-2.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
