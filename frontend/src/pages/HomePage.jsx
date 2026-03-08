import { useState, useEffect, useMemo } from 'react'
import { fetchProducts } from '../services/shopifyService'
import FilterSidebar from '../components/Marketplace/FilterSidebar'
import ProductGrid from '../components/Marketplace/ProductGrid'
import { Search } from 'lucide-react'

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
      const data = await fetchProducts()
      setAllProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Free text search
      if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase()))
        return false

      // Multi-select filters
      if (filters.sources.length > 0 && !filters.sources.includes(product.source)) return false
      if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition))
        return false
      if (filters.locations.length > 0 && !filters.locations.includes(product.location))
        return false

      // Price range
      if (filters.priceMin && product.price < parseFloat(filters.priceMin)) return false
      if (filters.priceMax && product.price > parseFloat(filters.priceMax)) return false

      return true
    })
  }, [allProducts, filters])

  return (
    <div className="flex flex-col w-full py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mb-16 relative w-full pt-12 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-[#003b73] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
            For Sale
          </span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs px-2">
            Want to Buy
          </span>
        </div>

        <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          The Marketplace for <span className="text-[#003b73]">NUS Students</span>
        </h2>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl font-light">
          Find textbooks, furniture, electronics, and more &mdash; sourced from trusted Singapore
          stores.
        </p>

        {/* Search Bar Container */}
        <div className="w-full max-w-2xl relative mb-8">
          <div className="absolute inset-0 bg-[#003b73]/5 blur-[24px] rounded-[32px] transform translate-y-2"></div>
          <div className="relative bg-white rounded-full shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] p-2 pr-2.5 flex items-center border border-gray-100">
            <div className="pl-6 pr-4">
              <Search className="w-5 h-5 text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Find textbooks, furniture, and more..."
              className="flex-1 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 text-lg w-full"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <button className="bg-[#003b73] text-white px-8 py-3.5 rounded-full font-bold ml-2 hover:bg-[#002f5c] transition-colors whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-12 max-w-[1400px] w-full mx-auto">
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003b73]"></div>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  )
}
