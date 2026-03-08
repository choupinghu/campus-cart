import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-lg">No items found matching your filters.</p>
        <p className="text-sm">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="flex-1">
      {/* Grid Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900">{products.length}</span>
          <span className="text-sm font-medium text-gray-400">items found</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-400 tracking-wide">Sort by:</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-bold text-gray-900">Newest</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
