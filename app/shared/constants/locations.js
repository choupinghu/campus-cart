/**
 * Shared NUS campus locations used across native features:
 * - Profile page
 * - Create / Modify Listing
 * - Want to Buy page (filters)
 * - NUS Campus Map (Feature 5)
 *
 * Each location has an (x, y) position expressed as a percentage (0–100)
 * relative to the campus map coordinate space. These percentages are used
 * to place pins on the SVG map regardless of its absolute dimensions; the
 * current NUSMap viewBox is 1000 × 1028.
 *
 * To add a new location, append an entry with { name, x, y }, where x and y
 * are percentage coordinates in the same 0–100 scale.
 */
export const NUS_LOCATIONS = [
  { name: 'UTown Residence', x: 22, y: 23.5 },
  { name: 'Raffles Hall', x: 24, y: 52 },
  { name: 'Science Faculty', x: 62, y: 64.5 },
  { name: "Prince George's Park", x: 81, y: 84 },
  { name: 'Kent Ridge Hall', x: 46, y: 92 },
  { name: 'School of Computing', x: 37.5, y: 73.5 },
]

/**
 * Backward-compatible flat array of location name strings.
 * Use this wherever a plain string[] is needed (dropdowns, filters, etc.)
 */
export const NUS_LOCATION_NAMES = NUS_LOCATIONS.map((l) => l.name)

const NUS_LOCATION_LOOKUP = Object.fromEntries(
  NUS_LOCATION_NAMES.map((name) => [name.toLowerCase(), name]),
)

// Legacy seed values grouped into nearest supported map anchor.
const LEGACY_LOCATION_ALIASES = {
  'biz library': 'Raffles Hall',
  'bukit timah campus': 'Raffles Hall',
  com1: 'School of Computing',
  com2: 'School of Computing',
  'central library': 'Science Faculty',
  'cinnamon college': 'UTown Residence',
  'e3 engineering': 'Science Faculty',
  'eusoff hall': 'Kent Ridge Hall',
  'kent ridge mrt': 'Science Faculty',
  lt27: 'Science Faculty',
  'mpsh court': 'Kent Ridge Hall',
  'mpsh field': 'Kent Ridge Hall',
  'pgp house 7': "Prince George's Park",
  'science library': 'Science Faculty',
  'sheares hall': 'Kent Ridge Hall',
  'tembusu college': 'UTown Residence',
  utown: 'UTown Residence',
  'utown / pgp': 'UTown Residence',
  'utown gym': 'UTown Residence',
  'utown pool': 'UTown Residence',
}

export function normalizeNusLocation(location) {
  if (typeof location !== 'string') return null

  const trimmed = location.trim()
  if (!trimmed) return null

  const lookupKey = trimmed.toLowerCase()
  return NUS_LOCATION_LOOKUP[lookupKey] || LEGACY_LOCATION_ALIASES[lookupKey] || null
}
