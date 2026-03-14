import { SOURCES, CONDITIONS, LOCATIONS } from '../../services/shopifyService'

export default function FilterSidebar({ filters, setFilters }) {
  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const currentSelection = prev[category] || []
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter((item) => item !== value)
        : [...currentSelection, value]
      return { ...prev, [category]: newSelection }
    })
  }

  const renderCheckboxes = (title, category, options) => (
    <div className="mb-8">
      <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="peer appearance-none w-5 h-5 border-[1.5px] border-gray-300 rounded focus:ring-0 checked:bg-nus-blue checked:border-nus-blue transition-all"
                checked={(filters[category] || []).includes(option)}
                onChange={() => handleCheckboxChange(category, option)}
              />
              <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full bg-white rounded-3xl p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] sticky top-24 border border-gray-50/50">
      <h2 className="text-lg font-bold text-gray-900 mb-8">Filters</h2>

      {renderCheckboxes('Source', 'sources', SOURCES)}
      {renderCheckboxes('Condition', 'conditions', CONDITIONS)}

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              S$
            </span>
            <input
              type="number"
              placeholder="Min"
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-nus-blue/20"
              value={filters.priceMin || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              S$
            </span>
            <input
              type="number"
              placeholder="Max"
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-nus-blue/20"
              value={filters.priceMax || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {renderCheckboxes('Location', 'locations', LOCATIONS)}
    </div>
  )
}
