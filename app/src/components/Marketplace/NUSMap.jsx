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
export default function NUSMap({
  selectedLocations = [],
  onLocationClick,
  onClearSelection,
  locationCounts = {},
  smaller = false,
}) {
  const [hoveredLocation, setHoveredLocation] = useState(null)

  // Convert percentage coords (0-100) to SVG coords (viewBox 1000 x 1028 to match 1953x2008 ratio)
  const toSvgX = (pct) => (pct / 100) * 1000
  const toSvgY = (pct) => (pct / 100) * 1028

  const isSelected = (name) => selectedLocations.includes(name)

  const hasHeatmap = Object.keys(locationCounts).length > 0
  const maxCount = Math.max(...Object.values(locationCounts), 1)

  const getDemandColor = (count) => {
    if (!hasHeatmap) return null
    if (count === 0) return '#003D7C' // Standard Blue
    const intensity = count / maxCount
    if (intensity > 0.7) return '#EF4444' // Red
    if (intensity > 0.3) return '#EF7C00' // Orange
    return '#003D7C' // Blue
  }

  return (
    <div className="w-full">
      {/* ── Section Header (Persistent Title & Legend) ── */}
      <div className="flex flex-row items-end justify-between mb-4 border-b border-gray-100 pb-3">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
            NUS Kent Ridge Campus
          </h2>
          <div className="flex flex-col items-start gap-2.5">
            {hasHeatmap && (
              /* Buy Side Legend (Heat Focus) */
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 py-1 px-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                    Heatmap:
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-nus-blue" />
                      Low
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-nus-orange" />
                      Mid
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      High
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map container */}
      <div
        className={`relative w-full ${smaller ? 'max-w-[400px]' : 'max-w-[800px]'} mx-auto overflow-hidden`}
      >
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
          <image href="/nus-map.png" x="0" y="0" width="1000" height="1028" opacity="0.9" />

          {/* ── Location Pins ── */}
          {NUS_LOCATIONS.map((loc) => {
            const cx = toSvgX(loc.x)
            const cy = toSvgY(loc.y)
            const selected = isSelected(loc.name)
            const hovered = hoveredLocation === loc.name

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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    if (e.key !== 'Enter') e.preventDefault()
                    onLocationClick?.(loc.name)
                  }
                }}
              >
                {/* ── Feature 6: Heatmap Radial Glow ── */}
                {hasHeatmap && locationCounts[loc.name] > 0 && (
                  <circle
                    cx="0"
                    cy="0"
                    r={(15 + (locationCounts[loc.name] / maxCount) * 25) * 2.25}
                    fill={getDemandColor(locationCounts[loc.name])}
                    opacity="0.15"
                  >
                    {locationCounts[loc.name] / maxCount > 0.6 && (
                      <>
                        <animate
                          attributeName="r"
                          values={`${(15 + (locationCounts[loc.name] / maxCount) * 25) * 2.25};${(20 + (locationCounts[loc.name] / maxCount) * 35) * 2.25};${(15 + (locationCounts[loc.name] / maxCount) * 25) * 2.25}`}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.15;0.35;0.15"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </>
                    )}
                  </circle>
                )}

                {/* Selection static halo (Translucent circle) */}
                {selected && <circle r="30" fill="#EF7C00" opacity="0.3" />}

                {/* Hover glow */}
                {hovered && !selected && <circle r="12" fill="#003D7C" opacity="0.1" />}

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
                  fill={hasHeatmap ? getDemandColor(locationCounts[loc.name]) : '#003D7C'}
                  stroke={selected ? 'white' : 'rgba(255,255,255,0.7)'}
                  strokeWidth={selected ? '3.5' : '1'}
                  style={{
                    transition: 'all 0.2s ease',
                    transform: 'scale(4) translateY(-2px)',
                    transformOrigin: '0px 0px',
                  }}
                />

                {/* Pin inner dot (Active focus) */}
                <circle
                  cy="-1"
                  r={selected ? 4 : 3}
                  fill="white"
                  opacity={selected ? 1 : 0.8}
                  style={{
                    transform: 'scale(4) translateY(-2px)',
                    transformOrigin: '0px 0px',
                    pointerEvents: 'none',
                    filter: selected ? 'drop-shadow(0 0 3px rgba(255,255,255,1))' : 'none',
                  }}
                />

                {/* Inline tooltip removed - relocated to fixed HUD overlay */}
              </g>
            )
          })}

        </svg>

        {/* ── Internal Dynamic HUD (Top Right - Scaled Down 50%) ── */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 text-right pointer-events-none">
          <div
            className={`bg-white/90 backdrop-blur-md p-2 rounded-xl border border-gray-100 shadow-lg flex flex-col items-end gap-0.5 min-w-[120px] transition-all duration-300 transform ${hoveredLocation || selectedLocations.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <h2 className="text-[11px] font-black text-nus-blue uppercase tracking-tight leading-none">
              {hoveredLocation || selectedLocations[selectedLocations.length - 1]}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[8px] font-black uppercase tracking-widest ${selectedLocations.includes(hoveredLocation || selectedLocations[selectedLocations.length - 1]) ? 'text-nus-orange' : 'text-gray-400'}`}
              >
                {selectedLocations.includes(
                  hoveredLocation || selectedLocations[selectedLocations.length - 1],
                )
                  ? '✦ Selected'
                  : '✦ Filter'}
              </span>
            </div>
          </div>

          {selectedLocations.length > 0 && (
            <button
              onClick={() => onClearSelection?.()}
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
              onClick={() => onLocationClick?.(name)}
              className="flex items-center gap-1.5 bg-nus-blue text-white text-[10px] font-black px-3 py-1.5 rounded-full hover:bg-red-500 transition-colors group"
              title={`Remove filter: ${name}`}
            >
              {name}
              <span className="opacity-70 group-hover:opacity-100">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
