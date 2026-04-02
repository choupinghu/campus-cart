import { Link } from 'react-router-dom'
import { MapPin, CheckCircle2, ExternalLink } from 'lucide-react'

// Map source name → store base URL for Shopify products
const STORE_URLS = {
  IUIGA: 'https://www.iuiga.com/products',
  'Bookshop.sg': 'https://bookshop.sg/products',
  'NUS Press': 'https://nuspress.nus.edu.sg/products',
}

export default function ProductCard({ product }) {
  const isCampusCart = product.source === 'User-listed' || product.source === 'CampusCart'

  // For Shopify products, build the real store URL from externalUrl handle
  const externalUrl =
    !isCampusCart && product.externalUrl
      ? `${STORE_URLS[product.source] || '#'}${product.externalUrl}`
      : null

  const cardClasses =
    'flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden group cursor-pointer h-full no-underline transition-all duration-300 hover:border-nus-blue/30 hover:shadow-2xl hover:shadow-nus-blue/5'

  const inner = (
    <>
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        {/* Condition Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-br from-white/95 to-gray-200/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] font-black text-gray-800 shadow-sm uppercase tracking-widest border border-white/20">
            {product.condition}
          </span>
        </div>

        {/* External link icon for Shopify products */}
        {!isCampusCart && (
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <span className="bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-lg flex items-center justify-center border border-white/50">
              <ExternalLink className="w-4 h-4 text-nus-blue" />
            </span>
          </div>
        )}

        <img
          src={product.image || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <span className="text-[10px] font-black text-nus-orange tracking-widest uppercase mb-1.5">
          {isCampusCart ? product.seller?.name || 'CampusCart' : product.source}
        </span>

        <h3 className="font-extrabold text-nus-blue text-lg leading-tight mb-3 line-clamp-2 min-h-[3rem] group-hover:text-nus-blue-hover transition-colors">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-1.5 mb-5 mt-auto">
          <span className="text-sm font-black text-nus-blue/60 uppercase">S$</span>
          <span className="text-3xl font-black text-nus-blue tracking-tight">
            {product.price.toFixed(2)}
          </span>
        </div>

        {/* Footer info: Location & Verified */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-400 gap-2 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-nus-orange/70 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest truncate">
              {product.location}
            </span>
          </div>

          {product.verified && (
            <div className="flex items-center gap-1.5 bg-nus-blue/5 text-nus-blue px-2.5 py-1 rounded-full flex-shrink-0 border border-nus-blue/10">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Verified</span>
            </div>
          )}
        </div>
      </div>
    </>
  )

  // CampusCart → internal route
  if (isCampusCart) {
    return (
      <Link to={`/listing/${product.id}`} className={cardClasses}>
        {inner}
      </Link>
    )
  }

  // Shopify → open store page in new tab
  return (
    <a href={externalUrl || '#'} target="_blank" rel="noopener noreferrer" className={cardClasses}>
      {inner}
    </a>
  )
}
