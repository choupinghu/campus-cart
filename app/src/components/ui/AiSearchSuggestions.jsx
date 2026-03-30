import { useState, useEffect, useMemo } from 'react'
import { Sparkles } from 'lucide-react'

/**
 * AiRecommendedSection
 *
 * 1. Takes the user's failed query.
 * 2. Fetches 3 broader keywords from AI.
 * 3. Automatically filters the 'items' prop for matches.
 * 4. Renders the section and items using the 'renderItem' fallback.
 */
export default function AiRecommendedSection({
  query,
  items,
  renderItem,
  title = 'Recommended For You',
  columns = 4,
}) {
  const [suggestionKeywords, setSuggestionKeywords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestionKeywords([])
      setLoading(false)
      return
    }

    const fetchKeywords = async () => {
      setLoading(true)
      setError(false)
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/ai/suggest-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ query }),
        })

        if (!res.ok) throw new Error('Failed to fetch AI keywords')
        const data = await res.json()
        setSuggestionKeywords(data.suggestions || [])
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchKeywords, 1000)
    return () => clearTimeout(timer)
  }, [query])

  // Logic: Find items that match the suggested keywords (fuzzy matching)
  const recommendedItems = useMemo(() => {
    if (suggestionKeywords.length === 0 || !items) return []

    // Split keywords into individual words for broader matching (e.g. "Laptop Gear" -> ["laptop", "gear"])
    const matchWords = suggestionKeywords
      .flatMap((k) => k.toLowerCase().split(/\s+/))
      .filter((w) => w.length > 2) // Only match words longer than 2 chars

    if (matchWords.length === 0) return []

    // Score each item based on how many keywords it contains
    const scored = items.map((item) => {
      const title = (item.title || '').toLowerCase()
      const desc = (item.description || '').toLowerCase()
      const cat = (
        typeof item.category === 'string' ? item.category : item.category?.name || ''
      ).toLowerCase()
      const source = (item.source || '').toLowerCase()

      const searchSpace = `${title} ${desc} ${cat} ${source}`

      let score = 0
      matchWords.forEach((word) => {
        if (searchSpace.includes(word)) score += 1
      })

      return { item, score }
    })

    // Filter out 0-score items and sort by highest score
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.item)
      .slice(0, 4) // Show up to 4 recommendations
  }, [suggestionKeywords, items])

  if (!query || query.length < 2) return null

  return (
    <div className="mt-16 pt-16 border-t border-dashed border-gray-100 w-full animate-in fade-in duration-700">
      <div className="flex flex-col items-center justify-center gap-6 min-h-[120px]">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600/60 transition-all">
              Finding similar items...
            </p>
          </div>
        ) : error ? (
          <p className="text-sm text-gray-400">Try adjusting your filters for better results.</p>
        ) : recommendedItems.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Our AI couldn&apos;t find any similar items right now. Try a broader search!
            </p>
          </div>
        ) : (
          <div className="w-full space-y-10">
            <div className="flex flex-col items-center gap-2">
              <h4 className="flex items-center gap-2.5 text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">
                <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-100" />
                {title}
              </h4>
              <div className="w-12 h-1 bg-indigo-500 rounded-full opacity-20" />
            </div>

            {/* Flex layout with justify-center to correctly handle fewer items */}
            <div className="flex flex-wrap justify-center gap-8 text-left w-full">
              {recommendedItems.map((item) => (
                <div
                  key={item.id}
                  className={`w-full ${columns === 4 ? 'md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]' : 'md:w-[calc(50%-1.5rem)]'} max-w-[350px] flex`}
                >
                  <div className="w-full flex">{renderItem(item)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
