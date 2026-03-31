import express from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { analyzeImage, checkOllamaHealth, suggestSearchTerms } from '../services/ai.js'

const router = express.Router()

/**
 * POST /api/ai/analyze-image
 * Accepts { imageUrl } and returns AI-generated listing suggestions.
 * Requires authentication.
 */
router.post('/analyze-image', requireAuth, async (req, res) => {
  const { imageUrl } = req.body

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is required.' })
  }

  try {
    console.log(`[AI] Analyzing image for user ${req.user.id}: ${imageUrl}`)
    const suggestions = await analyzeImage(imageUrl)
    console.log('[AI] Suggestions generated:', suggestions)

    res.json({ suggestions })
  } catch (err) {
    console.error('[AI] Analysis failed:', err.message)

    // Provide a user-friendly error based on the failure type
    if (err.message.includes('not found on disk')) {
      return res.status(404).json({ error: 'Image file not found. Please re-upload.' })
    }
    if (err.message.includes('Ollama API error') || err.message.includes('fetch failed')) {
      return res.status(503).json({
        error:
          'AI service is temporarily unavailable. Please try again or fill in the fields manually.',
      })
    }

    res.status(500).json({ error: 'Failed to analyze image. Please try again.' })
  }
})

/**
 * POST /api/ai/suggest-search
 * Accepts { query } and returns alternative search keywords.
 * Public endpoint.
 */
router.post('/suggest-search', async (req, res) => {
  const { query } = req.body

  if (!query) {
    return res.status(400).json({ error: 'query is required.' })
  }

  try {
    const suggestions = await suggestSearchTerms(query)
    res.json({ suggestions })
  } catch (err) {
    console.error('[AI] Search suggestion failed:', err.message)
    res.status(500).json({ error: 'Failed to generate search suggestions.' })
  }
})

/**
 * GET /api/ai/health
 * Check if Ollama is reachable and the model is loaded.
 * Public endpoint (no auth required) for debugging.
 */
router.get('/health', async (req, res) => {
  const health = await checkOllamaHealth()
  res.json(health)
})

export default router
