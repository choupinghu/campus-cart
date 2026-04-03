import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { graphqlRequest } from '../services/graphqlClient'
import { ChevronRight, MapPin, CheckCircle, MessageCircle, Star, ArrowLeft } from 'lucide-react'

const GET_LISTING_BY_ID = `
  query GetListing($id: ID!) {
    listing(id: $id) {
      id
      title
      price
      imageUrl
      condition
      location
      description
      seller {
        name
        image
      }
    }
  }
`

export default function ListingDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await graphqlRequest(GET_LISTING_BY_ID, { id })
        if (!data?.listing) {
          setError('Listing not found or has been removed.')
        } else {
          setProduct(data.listing)
        }
      } catch (err) {
        console.error('Failed to load listing:', err)
        setError(err.message || 'Could not load this listing.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-nus-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
        <div className="text-center space-y-2">
          <p className="text-2xl font-black text-gray-900">Could not load listing</p>
          {error && <p className="text-sm text-red-500 font-medium max-w-md">{error}</p>}
        </div>
        <Link to="/" className="text-nus-blue font-bold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>
      </div>
    )
  }

  const imageUrl = product.imageUrl || 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image'

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-6">
        <ol className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <li>
            <Link to="/" className="hover:text-nus-blue transition-colors">
              Home
            </Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li>
            <span className="text-nus-blue">{product.title}</span>
          </li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ── Image ── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 relative shadow-2xl shadow-black/5">
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* ── Info ── */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-50 text-nus-blue text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
                {product.seller?.name || 'CampusCart'}
              </span>
              {product.condition && (
                <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-black bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest">
                  <CheckCircle className="w-3 h-3" />
                  {product.condition}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-black text-gray-900 leading-tight">{product.title}</h1>

            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-nus-blue">
                S$ {parseFloat(product.price).toFixed(2)}
              </span>
              <span className="text-gray-400 font-bold mb-1">Fixed Price</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm line-clamp-6">
                {product.description}
              </p>
              {product.location && (
                <div className="pt-4 flex items-center gap-2 text-xs text-gray-500 font-bold">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {product.location}
                </div>
              )}
            </div>
          )}

          {/* Seller card */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-black/5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">
              Seller Information
            </p>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  {product.seller?.image ? (
                    <img
                      src={product.seller.image}
                      alt={product.seller.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Star className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-gray-900">
                    {product.seller?.name || 'NUS Student'}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-nus-blue" />
                    <span className="text-[10px] font-black text-nus-blue uppercase">
                      Verified Student
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Replies within 1 hour</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-nus-orange font-black">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.9</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400">(12 Reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-nus-orange text-white font-black py-4 rounded-2xl text-sm shadow-lg shadow-nus-orange/20 hover:scale-[1.02] active:scale-95 transition-all">
                Make an Offer →
              </button>
              <button className="bg-white border-2 border-gray-100 text-gray-900 font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all">
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
