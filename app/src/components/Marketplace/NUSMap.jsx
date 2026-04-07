import { useState } from 'react'
import { NUS_LOCATIONS } from '../../constants/locations'

/**
 * NUSMap — Interactive SVG silhouette of the NUS Kent Ridge campus.
 *
 * Props:
 *   selectedLocations  string[]  — currently active location filters
 *   onLocationClick    fn(name)  — called when a pin is clicked (toggle)
 *   locationCounts     Record<string, number>  — optional, for Feature 6 heatmap
 */
export default function NUSMap({ selectedLocations = [], onLocationClick, locationCounts = {}, smaller = false }) {
  const [hoveredLocation, setHoveredLocation] = useState(null)

  // Convert percentage coords (0-100) to SVG coords (viewBox 1000 x 1028 to match 1953x2008 ratio)
  const toSvgX = (pct) => (pct / 100) * 1000
  const toSvgY = (pct) => (pct / 100) * 1028

  const isSelected = (name) => selectedLocations.includes(name)

  return (
    <div className="w-full">
      {/* ── Section Header (Persistent Title & Legend) ── */}
      <div className="flex flex-row items-end justify-between mb-4 border-b border-gray-100 pb-3">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
            NUS Kent Ridge Campus
          </h2>
          <div className="flex items-center gap-4 opacity-70">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-nus-blue border border-white shadow-sm" />
              Location
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-nus-orange border border-white shadow-sm" />
              Selected
            </span>
          </div>
        </div>
      </div>

      {/* Map container */}

      {/* Map container */}
      <div className={`relative w-full ${smaller ? 'max-w-[400px]' : 'max-w-[800px]'} mx-auto overflow-hidden`}>
        <svg
          viewBox="0 0 1000 1028"
          className="w-full h-auto"
          role="img"
          aria-label="NUS Kent Ridge campus map with location pins"
        >
          {/* ── Campus silhouette ── */}
          {/* Outer water / surroundings */}
          <rect width="1000" height="1028" fill="#EFF6FF" />

          {/* User's custom Google Map overlay (add nus-map.png to public folder) */}
          <image
            href="/nus-map.png"
            x="0"
            y="0"
            width="1000"
            height="1028"
            opacity="0.9"
          />



          {/* ── Location Pins ── */}
          {NUS_LOCATIONS.map((loc) => {
            const cx = toSvgX(loc.x)
            const cy = toSvgY(loc.y)
            const selected = isSelected(loc.name)
            const hovered = hoveredLocation === loc.name
            const active = selected || hovered

            return (
              <g
                key={loc.name}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => onLocationClick?.(loc.name)}
                onMouseEnter={() => setHoveredLocation(loc.name)}
                onMouseLeave={() => setHoveredLocation(null)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`Filter by ${loc.name}${selected ? ' (selected)' : ''}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onLocationClick?.(loc.name)}
              >
                {/* Selection pulse ring */}
                {selected && (
                  <>
                    <circle
                      r="22"
                      fill="none"
                      stroke="#003D7C"
                      strokeWidth="2"
                      opacity="0.25"
                      className="nus-map-ring-1"
                    />
                    <circle
                      r="16"
                      fill="none"
                      stroke="#003D7C"
                      strokeWidth="1.5"
                      opacity="0.4"
                    />
                  </>
                )}

                {/* Hover glow */}
                {hovered && !selected && (
                  <circle r="12" fill="#003D7C" opacity="0.1" />
                )}

                {/* Pin shadow */}
                <ellipse cx="0" cy="18" rx="10" ry="4" fill="rgba(0,0,0,0.15)" />

                {/* Pin body — teardrop shape (Static 400% size) */}
                <path
                  d={`
                    M 0,-14
                    C -8,-14 -12,-8 -12,0
                    C -12,8 0,14 0,14
                    C 0,14 12,8 12,0
                    C 12,-8 8,-14 0,-14
                    Z
                  `}
                  fill={active ? '#EF7C00' : '#003D7C'}
                  stroke="white"
                  strokeWidth="2"
                  style={{
                    transition: 'all 0.2s ease',
                    transform: 'scale(4) translateY(-2px)',
                    transformOrigin: '0px 0px',
                  }}
                />

                {/* Pin inner dot */}
                <circle
                  cy="-1"
                  r="3.5"
                  fill="white"
                  opacity="0.85"
                  style={{
                    transform: 'scale(4) translateY(-2px)',
                    transformOrigin: '0px 0px',
                    pointerEvents: 'none',
                  }}
                />

                {/* Inline tooltip removed - relocated to fixed HUD overlay */}
              </g>
            )
          })}

          {/* SVG filter for drop shadow */}
          <defs>
            <filter id="pin-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>
        </svg>

        {/* ── Internal Dynamic HUD (Top Right - Scaled Down 50%) ── */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 text-right pointer-events-none">
          <div className={`bg-white/90 backdrop-blur-md p-2 rounded-xl border border-gray-100 shadow-lg flex flex-col items-end gap-0.5 min-w-[120px] transition-all duration-300 transform ${hoveredLocation || selectedLocations.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h2 className="text-[11px] font-black text-nus-blue uppercase tracking-tight leading-none">
              {hoveredLocation || selectedLocations[selectedLocations.length - 1]}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[8px] font-black uppercase tracking-widest ${selectedLocations.includes(hoveredLocation || selectedLocations[selectedLocations.length - 1]) ? 'text-nus-orange' : 'text-gray-400'}`}>
                {selectedLocations.includes(hoveredLocation || selectedLocations[selectedLocations.length - 1]) ? '✦ Selected' : '✦ Filter'}
              </span>
            </div>
          </div>

          {selectedLocations.length > 0 && (
            <button
              onClick={() => NUS_LOCATIONS.forEach((loc) => isSelected(loc.name) && onLocationClick(loc.name))}
              className="pointer-events-auto text-[7px] font-black text-white bg-nus-blue hover:bg-red-500 px-2 py-1 rounded-md uppercase tracking-widest transition-colors shadow-sm"
            >
              Clear ({selectedLocations.length})
            </button>
          )}
        </div>
      </div>

      {/* Active filters chips */}
      {selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedLocations.map((name) => (
            <button
              key={name}
              onClick={() => onLocationClick(name)}
              className="flex items-center gap-1.5 bg-nus-blue text-white text-[10px] font-black px-3 py-1.5 rounded-full hover:bg-red-500 transition-colors group"
              title={`Remove filter: ${name}`}
            >
              {name}
              <span className="opacity-70 group-hover:opacity-100">×</span>
            </button>
          ))}
        </div>
      )}

      {/* Pulse ring animation */}
      <style>{`
        @keyframes nus-map-pulse {
          0%, 100% { r: 20; opacity: 0.3; }
          50% { r: 26; opacity: 0.1; }
        }
        .nus-map-ring-1 {
          animation: nus-map-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
