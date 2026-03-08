import { MapPin, CheckCircle2 } from 'lucide-react'

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col overflow-hidden bg-white group cursor-pointer h-full">
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-gray-50 overflow-hidden mb-4">
        {/* Condition Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-sm uppercase tracking-wider">
            {product.condition}
          </span>
        </div>

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1">
        <span className="text-[10px] font-bold text-purple-600 tracking-widest uppercase mb-1">
          {product.source}
        </span>

        <h3 className="font-bold text-nus-blue text-lg leading-tight mb-2 line-clamp-2 min-h-[3rem]">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-1 mb-4 mt-auto">
          <span className="text-sm font-bold text-nus-blue">S$</span>
          <span className="text-2xl font-black text-nus-blue">{product.price.toFixed(2)}</span>
        </div>

        {/* Footer info: Location & Verified */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center text-gray-400 gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wide truncate">
              {product.location}
            </span>
          </div>

          {product.verified && (
            <div className="flex items-center gap-1 bg-nus-blue/10 text-nus-blue px-2 py-1 rounded-full flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
