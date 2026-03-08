// List of sources
export const SOURCES = ['IUIGA', 'Bookshop.sg', 'NUS Press']
export const CONDITIONS = ['New / Sealed', 'Like New', 'Good', 'Used']
export const LOCATIONS = [
  'Kent Ridge Hall',
  "Prince George's Park",
  'UTown Residence',
  'Raffles Hall',
]

const ENDPOINTS = {
  IUIGA: 'https://www.iuiga.com/products.json?limit=20',
  'Bookshop.sg': 'https://bookshop.sg/products.json?limit=20',
  'NUS Press': 'https://nuspress.nus.edu.sg/products.json?limit=20',
}

// Helper to assign mock attributes
const assignMockAttributes = (product) => {
  // Random condition
  const randomCondition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)]
  // Random location
  const randomLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
  // 70% chance to be verified
  const isVerified = Math.random() > 0.3

  return {
    ...product,
    condition: randomCondition,
    location: randomLocation,
    verified: isVerified,
  }
}

// Normalize a shopify product
const normalizeShopifyProduct = (item, sourceName) => {
  const image = item.images && item.images.length > 0 ? item.images[0].src : ''
  const priceStr = item.variants && item.variants.length > 0 ? item.variants[0].price : '0.00'

  return {
    id: `${sourceName}-${item.id}`,
    title: item.title,
    price: parseFloat(priceStr),
    image: image,
    source: sourceName,
    externalUrl: item.handle ? `/${item.handle}` : '#',
  }
}

export const fetchProducts = async () => {
  const allProducts = []

  // Fetch from live endpoints
  const fetchPromises = Object.entries(ENDPOINTS).map(async ([sourceName, url]) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      const normalized = data.products.map((p) => normalizeShopifyProduct(p, sourceName))
      allProducts.push(...normalized)
    } catch (error) {
      console.error(`Failed to fetch from ${sourceName}:`, error)
    }
  })

  await Promise.all(fetchPromises)

  // Apply mock condition/location to all products
  return allProducts.map(assignMockAttributes).sort(() => Math.random() - 0.5) // Shuffle
}
