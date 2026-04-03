import { useState, useMemo, Suspense, useEffect } from 'react'
import { Search, ChevronDown, Tag, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSession } from '../lib/auth'
import Antigravity from '../components/Antigravity'
import SpotlightCard from '../components/SpotlightCard'
import AiSearchSuggestions from '../components/ui/AiSearchSuggestions'
import { NUS_LOCATIONS } from '../constants/locations'
import { CATEGORIES } from '../constants/categories'
import { graphqlRequest } from '../services/graphqlClient'

const GET_REQUESTS = `
  query GetRequests($userId: String) {
    requests(userId: $userId) {
      id
      title
      description
      budget
      condition
      location
      createdAt
      category { name }
      user {
        id
        name
        image
      }
    }
  }
`

const SORT_OPTIONS = ['Newest', 'Budget: High to Low', 'Budget: Low to High', 'Urgent First']

function formatPostedAgo(dateStr) {
  if (!dateStr) return 'some time ago'
  const isNumeric = /^\d+$/.test(dateStr.toString())
  const date = isNumeric ? new Date(parseInt(dateStr)) : new Date(dateStr)

  if (isNaN(date.getTime())) return 'some time ago'

  const now = new Date()
  const diff = now - date
  const mins = Math.floor(Math.abs(diff) / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (mins > 0) return `${mins} min${mins > 1 ? 's' : ''} ago`
  return 'Just now'
}

export default function WantToBuyPage() {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [budgetMax, setBudgetMax] = useState('')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Newest')
  const [sortOpen, setSortOpen] = useState(false)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await graphqlRequest(GET_REQUESTS)
        if (data?.requests) {
          const mapped = data.requests.map((r) => ({
            ...r,
            category: r.category?.name || 'Other',
            name: r.user?.name || 'NUS Student',
            avatar:
              r.user?.image ||
              'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (r.user?.id || 'default'),
            urgent: r.description?.toLowerCase().includes('urgent') || false,
            postedAgo: formatPostedAgo(r.createdAt),
            saved: false,
          }))
          setListings(mapped)
        }
      } catch (err) {
        console.error('Failed to fetch requests:', err)
      } finally {
        setLoading(false)
      }
    }
    loadRequests()
  }, [])

  const toggle = (list, setter, item) =>
    setter((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLocations([])
    setBudgetMax('')
    setUrgentOnly(false)
    setSearchQuery('')
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedLocations.length +
    (budgetMax ? 1 : 0) +
    (urgentOnly ? 1 : 0)

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      const max = budgetMax === '' ? Infinity : parseFloat(budgetMax)
      return (
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategories.length === 0 || selectedCategories.includes(l.category)) &&
        (selectedLocations.length === 0 || selectedLocations.includes(l.location)) &&
        l.budget <= max &&
        (!urgentOnly || l.urgent)
      )
    })

    if (sortBy === 'Newest') {
      result = [...result].sort((a, b) => {
        const timeA = /^\d+$/.test(a.createdAt?.toString())
          ? parseInt(a.createdAt)
          : new Date(a.createdAt).getTime()
        const timeB = /^\d+$/.test(b.createdAt?.toString())
          ? parseInt(b.createdAt)
          : new Date(b.createdAt).getTime()
        return (timeB || 0) - (timeA || 0)
      })
    } else if (sortBy === 'Budget: High to Low') {
      result = [...result].sort((a, b) => b.budget - a.budget)
    } else if (sortBy === 'Budget: Low to High') {
      result = [...result].sort((a, b) => a.budget - b.budget)
    } else if (sortBy === 'Urgent First') {
      result = [...result].sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
    }

    return result
  }, [listings, searchQuery, selectedCategories, selectedLocations, budgetMax, urgentOnly, sortBy])

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      {/* ── Hero ── */}
      <section className="bg-white pt-16 pb-24 relative overflow-hidden text-center">
        {/* Antigravity particle background */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <Suspense fallback={null}>
            <Antigravity
              count={220}
              color="var(--color-nus-orange)"
              particleSize={1.4}
              magnetRadius={12}
              ringRadius={8}
              waveSpeed={0.5}
              waveAmplitude={1.2}
              lerpSpeed={0.08}
              autoAnimate={true}
              rotationSpeed={0.15}
              fieldStrength={8}
            />
          </Suspense>
        </div>

        {/* Gradient overlay so text stays readable */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-transparent to-white/80 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        <div className="max-w-7xl mx-auto px-4 relative" style={{ zIndex: 2 }}>
          {/* Page tabs */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-500 text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest transition-all"
            >
              For Sale
            </Link>
            <div className="inline-flex items-center gap-2 bg-[var(--color-nus-orange)] text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-[var(--color-nus-orange)]/40">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Want to Buy
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            What Students Are <span className="text-[var(--color-nus-orange)]">Looking For</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Browse requests from NUS students — be the seller, make the deal happen.
          </p>

          {/* Search */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-nus-orange to-nus-blue rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
            <div className="relative bg-white flex items-center p-2 rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-4 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search for what students are looking for..."
                className="flex-1 bg-transparent border-none py-4 text-gray-900 focus:ring-0 placeholder:text-gray-400 outline-none min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs font-bold text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[var(--color-nus-orange)] rounded-full" />
              {listings.length} active requests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-400 rounded-full" />
              {listings.filter((l) => l.urgent).length} urgent
            </span>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:block">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-24 space-y-8">
            <h3 className="font-black text-gray-900 flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                Filters
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-black bg-[var(--color-nus-orange)] text-white w-5 h-5 flex items-center justify-center rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-black text-[var(--color-nus-orange)] uppercase tracking-widest hover:underline"
                >
                  Clear All
                </button>
              )}
            </h3>

            {/* Urgent toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setUrgentOnly((v) => !v)}
                  className={`w-10 h-6 rounded-full border-2 relative transition-all cursor-pointer ${urgentOnly ? 'bg-red-500 border-red-500' : 'bg-gray-100 border-gray-200'}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${urgentOnly ? 'left-4' : 'left-0.5'}`}
                  />
                </div>
                <span
                  className={`text-sm font-bold transition-colors ${urgentOnly ? 'text-red-500' : 'text-gray-500'}`}
                >
                  Urgent Only 🔴
                </span>
              </label>
            </div>

            {/* Budget Max */}
            <div>
              <p className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest">
                Max Budget
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  S$
                </span>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-7 pr-2 text-xs focus:bg-white focus:border-[var(--color-nus-orange)] outline-none transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest">
                Category
              </p>
              <div className="space-y-3">
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c)}
                      onChange={() => toggle(selectedCategories, setSelectedCategories, c)}
                      className="w-5 h-5 accent-[var(--color-nus-orange)] cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${selectedCategories.includes(c) ? 'text-[var(--color-nus-orange)] font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}
                    >
                      {c}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest">
                Location
              </p>
              <div className="space-y-3">
                {NUS_LOCATIONS.map((l) => (
                  <label key={l} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(l)}
                      onChange={() => toggle(selectedLocations, setSelectedLocations, l)}
                      className="w-5 h-5 accent-[var(--color-nus-orange)] cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${selectedLocations.includes(l) ? 'text-[var(--color-nus-orange)] font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}
                    >
                      {l}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Listings Grid ── */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-gray-900">
              {filtered.length}
              <span className="text-gray-400 font-medium text-base ml-2">requests found</span>
            </h2>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
              >
                <span>
                  Sort: <span className="text-gray-900">{sortBy}</span>
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl z-20 py-2 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortBy(opt)
                        setSortOpen(false)
                      }}
                      className={`w-full text-left px-5 py-2.5 text-sm font-bold transition-colors ${sortBy === opt ? 'text-[var(--color-nus-orange)] bg-amber-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-nus-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((listing) => (
                <WTBCard key={listing.id} listing={listing} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 lg:p-20 rounded-[3rem] text-center border border-gray-100 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] w-full">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-amber-50/50">
                <Search className="w-10 h-10 text-[var(--color-nus-orange)]" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any requests matching your filters or search keywords.
              </p>
              <button
                onClick={clearFilters}
                className="bg-[var(--color-nus-orange)] text-white px-10 py-3.5 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--color-nus-orange)]/20"
              >
                Clear All Filters
              </button>

              <div className="w-full max-w-5xl mx-auto">
                <AiSearchSuggestions
                  query={searchQuery}
                  items={listings}
                  columns={2}
                  renderItem={(listing) => (
                    <WTBCard key={listing.id} listing={listing} isLoggedIn={isLoggedIn} />
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── WTB Card ──────────────────────────────────────────────────────────────────
function WTBCard({ listing, isLoggedIn }) {
  return (
    <SpotlightCard
      className="group bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      spotlightColor="rgba(239, 124, 0, 0.12)"
    >
      {/* Urgent ribbon */}
      {listing.urgent && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl rounded-tr-[2rem] uppercase tracking-widest">
          🔴 Urgent
        </div>
      )}

      {/* Top row: avatar + name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={listing.avatar}
            alt={listing.name}
            className="w-10 h-10 rounded-full border-2 border-gray-100 bg-gray-100"
          />
          <div>
            <p className="text-sm font-black text-gray-900 leading-tight">{listing.name}</p>
            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {listing.postedAgo}
            </p>
          </div>
        </div>
      </div>

      {/* Category pill */}
      <span className="inline-flex items-center gap-1.5 text-[9px] font-black bg-amber-50 border border-amber-100 text-[var(--color-nus-orange)] px-3 py-1 rounded-full uppercase tracking-widest w-fit">
        <Tag className="w-2.5 h-2.5" />
        {listing.category}
      </span>

      {/* Title + description */}
      <div>
        <h3 className="font-black text-gray-900 leading-snug tracking-tight group-hover:text-[var(--color-nus-orange)] transition-colors">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
          {listing.description}
        </p>
      </div>

      {/* Info row */}
      <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 pt-1">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-nus-orange)]" />
          {listing.location}
        </span>
        {listing.condition !== 'Any' && (
          <span className="bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
            Min: {listing.condition}
          </span>
        )}
      </div>

      {/* Footer: budget + contact */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Budget
          </p>
          <p className="text-xl font-black text-[var(--color-nus-orange)] flex items-baseline gap-1">
            <span className="text-xs">up to S$</span>
            {listing.budget.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => !isLoggedIn && (window.location.href = '/login')}
          className="flex items-center gap-2 bg-nus-blue hover:bg-nus-blue-hover text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg shadow-nus-blue/15 transition-all active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />I Have This
        </button>
      </div>
    </SpotlightCard>
  )
}
