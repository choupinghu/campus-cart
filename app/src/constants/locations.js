/**
 * Shared NUS campus locations used across native features:
 * - Profile page
 * - Create / Modify Listing
 * - Want to Buy page (filters)
 * - NUS Campus Map (Feature 5)
 *
 * Each location has an (x, y) position expressed as a percentage (0–100)
 * of the SVG viewBox (800 × 500), used to place pins on the campus map.
 *
 * To add a new location, append an entry with { name, x, y }.
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
