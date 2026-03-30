import { useState, useEffect, useMemo, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/shopifyService'
import { graphqlRequest } from '../services/graphqlClient'
import FilterSidebar from '../components/Marketplace/FilterSidebar'
import ProductGrid from '../components/Marketplace/ProductGrid'
import ProductCard from '../components/Marketplace/ProductCard'
import Antigravity from '../components/Antigravity'
import AiSearchSuggestions from '../components/ui/AiSearchSuggestions'
import { Search } from 'lucide-react'

const GET_LISTINGS = `
  query GetListings {
    listings {
      id
      title
      price
      imageUrl
      condition
      location
      description
      category { name }
    }
  }
`

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: '',
    sources: [],
    conditions: [],
    locations: [],
    priceMin: '',
    priceMax: '',
  })

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const [shopifyRes, dbRes] = await Promise.allSettled([
          fetchProducts(),
          graphqlRequest(GET_LISTINGS),
        ])

        let shopifyProducts = []
        if (shopifyRes.status === 'fulfilled') {
          shopifyProducts = shopifyRes.value
        } else {
          console.error('Failed to fetch Shopify products:', shopifyRes.reason)
        }

        let dbListings = []
        if (dbRes.status === 'fulfilled') {
          dbListings = dbRes.value.listings.map((listing) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            image: listing.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image',
            source: 'CampusCart',
            condition: listing.condition || 'Used',
            location: listing.location || 'NUS Campus',
            category: listing.category?.name || 'Other',
            description: listing.description || '',
            verified: true,
          }))
        } else {
          console.error('Failed to fetch DB listings:', dbRes.reason)
        }

        const merged = [...dbListings, ...shopifyProducts].sort(() => Math.random() - 0.5)
        setAllProducts(merged)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase()))
        return false
      if (filters.sources.length > 0 && !filters.sources.includes(product.source)) return false
      if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition))
        return false
      if (filters.locations.length > 0 && !filters.locations.includes(product.location))
        return false
      if (filters.priceMin && product.price < parseFloat(filters.priceMin)) return false
      if (filters.priceMax && product.price > parseFloat(filters.priceMax)) return false
      return true
    })
  }, [allProducts, filters])

  return (
    <div className="flex flex-col w-full">
      {/* ── Hero Section ── */}
      <section className="bg-white pt-16 pb-24 relative overflow-hidden text-center">
        {/* Antigravity particle background */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <Suspense fallback={null}>
            <Antigravity
              count={200}
              color="#4a90d9"
              particleSize={1.3}
              magnetRadius={11}
              ringRadius={7}
              waveSpeed={0.4}
              waveAmplitude={1}
              lerpSpeed={0.08}
              autoAnimate={true}
              rotationSpeed={0.1}
              fieldStrength={9}
            />
          </Suspense>
        </div>

        {/* Gradient overlay so text stays readable */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-transparent to-white/80 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        <div className="max-w-7xl mx-auto px-4 relative" style={{ zIndex: 2 }}>
          {/* Page tabs */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-nus-blue text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-nus-blue/20">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              For Sale
            </div>
            <Link
              to="/want-to-buy"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-amber-50 hover:text-[#EF7C00] text-gray-500 text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest transition-all"
            >
              Want to Buy
            </Link>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            The Marketplace for <span className="text-nus-blue">NUS Students</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Find textbooks, furniture, electronics, and more — sourced from trusted Singapore
            stores.
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-nus-blue to-[#EF7C00] rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
            <div className="relative bg-white flex items-center p-2 rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-4 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Find textbooks, furniture, and more..."
                className="flex-1 bg-transparent border-none py-4 text-gray-900 focus:ring-0 placeholder:text-gray-400 outline-none min-w-0"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
              <button className="bg-nus-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-nus-blue-hover transition-all shrink-0">
                Search
              </button>
            </div>
          </div>

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-nus-blue text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest mt-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live · IUIGA · Bookshop.sg · NUS Press
          </div>
        </div>
      </section>

      {/* ── Main Content: Sidebar + Grid ── */}
      <div className="flex flex-col lg:flex-row gap-12 max-w-[1400px] w-full mx-auto px-4 py-12">
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="w-12 h-12 border-4 border-nus-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Fetching listings…
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-12 lg:p-20 rounded-[3rem] text-center border border-gray-100 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] w-full">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-blue-50/50">
                <Search className="w-10 h-10 text-nus-blue" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any listings matching your current search or filters.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    sources: [],
                    conditions: [],
                    locations: [],
                    priceMin: '',
                    priceMax: '',
                  })
                }
                className="bg-nus-blue text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-nus-blue-hover hover:scale-105 active:scale-95 transition-all shadow-xl shadow-nus-blue/20"
              >
                Clear All Filters
              </button>

              <AiSearchSuggestions
                query={filters.search}
                items={allProducts}
                renderItem={(product) => <ProductCard key={product.id} product={product} />}
              />
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  )
}
