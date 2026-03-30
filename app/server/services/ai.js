import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads')

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://ollama:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llava:7b'

// Valid categories & conditions — must stay in sync with frontend constants
const VALID_CATEGORIES = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Other']
const VALID_CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

/**
 * Analyze an uploaded image using Ollama's vision model and return
 * structured listing/request suggestions.
 *
 * @param {string} imageUrl - The full URL of the uploaded image (e.g. http://localhost:8000/uploads/xxx.jpg)
 * @returns {Promise<object>} Parsed suggestions { title, description, suggestedPrice, condition, category }
 */
export async function analyzeImage(imageUrl) {
  // 1. Extract filename from URL and read from disk
  const filename = path.basename(new URL(imageUrl).pathname)
  const filePath = path.join(uploadsDir, filename)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Image file not found on disk: ${filename}`)
  }

  const imageBuffer = fs.readFileSync(filePath)
  const base64Image = imageBuffer.toString('base64')

  // 2. Build the prompt — ask for structured JSON output
  const prompt = `Analyze this image for a marketplace listing.

Provide the following details:
1. title: A catchy, concise title (max 60 chars)
2. description: A clear 1-2 sentence description of the item and its visible state
3. suggestedPrice: A fair price in SGD (number only)
4. category: Choose exactly one from [Electronics, Textbooks, Furniture, Clothing, Other]
5. condition: Choose exactly one from [New, Like New, Good, Fair]

You MUST return ONLY a valid JSON object. Do not include any other text.
Example format:
{
  "title": "Black Office Chair",
  "description": "A standard black ergonomic office chair. Looks to be in fair condition with some visible wear.",
  "suggestedPrice": 25.00,
  "category": "Furniture",
  "condition": "Fair"
}`

  // 3. Call Ollama API
  console.log(`[AI-Service] Analyzing image with ${OLLAMA_MODEL}...`)
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      images: [base64Image],
      stream: false,
      format: 'json',
      options: {
        temperature: 0.1, // Even lower temperature for stricter adherence to format
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ollama API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const rawResponse = data.response || ''

  console.log('[AI-Service] Raw model response:', rawResponse)

  // 4. Parse the JSON response from the model
  const suggestions = parseModelResponse(rawResponse)
  return suggestions
}

/**
 * Parse the raw model text response and extract a valid JSON object.
 * Handles cases where the model wraps output in markdown code fences or uses slightly different keys.
 */
function parseModelResponse(raw) {
  let cleaned = raw.trim()

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  }

  // Find the first '{' and last '}' to extract potential JSON
  const startIdx = cleaned.indexOf('{')
  const endIdx = cleaned.lastIndexOf('}')

  if (startIdx === -1 || endIdx === -1) {
    console.error('[AI-Service] No JSON found in response')
    return getDefaultSuggestions()
  }

  const jsonString = cleaned.substring(startIdx, endIdx + 1)

  try {
    const parsed = JSON.parse(jsonString)

    // Normalize keys (common variations)
    const title = parsed.title || parsed.name || parsed.item || 'Untitled Item'
    const description = parsed.description || parsed.desc || parsed.details || ''
    const rawPrice = parsed.suggestedPrice || parsed.price || parsed.cost
    const condition = parsed.condition || parsed.status || 'Good'
    const category = parsed.category || parsed.type || 'Other'

    // Validate and sanitize each field
    return {
      title: (typeof title === 'string' ? title : String(title)).slice(0, 60),
      description: (typeof description === 'string' ? description : String(description)).slice(
        0,
        500,
      ),
      suggestedPrice:
        typeof rawPrice === 'number' && rawPrice > 0 ? Math.round(rawPrice * 100) / 100 : 10.0,
      condition: VALID_CONDITIONS.includes(condition) ? condition : 'Good',
      category: VALID_CATEGORIES.includes(category) ? category : 'Other',
    }
  } catch (err) {
    console.error('[AI-Service] Failed to parse AI JSON response:', err.message)
    return getDefaultSuggestions()
  }
}

/**
 * Fallback suggestions when the model response cannot be parsed.
 */
function getDefaultSuggestions() {
  return {
    title: '',
    description: '',
    suggestedPrice: 10.0,
    condition: 'Good',
    category: 'Other',
  }
}

/**
 * Check if the Ollama service is reachable and the model is available.
 */
export async function checkOllamaHealth() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return { healthy: false, reason: 'Ollama not responding' }

    const data = await response.json()
    const models = data.models || []
    const hasModel = models.some((m) => m.name.startsWith(OLLAMA_MODEL))

    return {
      healthy: true,
      modelLoaded: hasModel,
      availableModels: models.map((m) => m.name),
    }
  } catch (err) {
    return { healthy: false, reason: err.message }
  }
}

/**
 * Suggest alternative search terms when a user search yields no results.
 * Uses Ollama to provide 3 broader or synonymous keywords.
 *
 * @param {string} query - The original failed search query
 * @returns {Promise<string[]>} Array of 3 string suggestions
 */
export async function suggestSearchTerms(query) {
  if (!query || typeof query !== 'string') return []

  // 1. Simpler, more direct prompt for the model
  const prompt = `A user searched for "${query}" in a university student marketplace but found 0 results.
Task: Provide a list of 3 broader search terms that will help them find what they need.
Rules:
- Respond ONLY with the 3 terms.
- Use commas to separate them.
- Do not include any other text.
Example: Electronics, Laptop, Computer`

  try {
    console.log(`[AI-Service] Suggesting terms for "${query}" with ${OLLAMA_MODEL}...`)
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 50, // Keep it short and fast
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ollama API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const rawResponse = data.response || ''

    console.log(`[AI-Service] Raw response for "${query}":`, rawResponse.trim())

    // 2. Multi-stage parsing logic (Robust)
    let suggestions = []
    let cleaned = rawResponse.trim()

    // Check for JSON array first
    if (cleaned.includes('[') && cleaned.includes(']')) {
      try {
        const startIdx = cleaned.indexOf('[')
        const endIdx = cleaned.lastIndexOf(']')
        const jsonString = cleaned.substring(startIdx, endIdx + 1)
        const parsed = JSON.parse(jsonString)
        if (Array.isArray(parsed)) suggestions = parsed
      } catch (_) {
        /* fall through */
      }
    }

    // If still empty, try comma-separated fallback
    if (suggestions.length === 0) {
      // Split by comma or newline, filter out junk
      suggestions = cleaned
        .split(/[,\n]/)
        .map((s) => s.trim().replace(/^[-*•0-9.]+\.?\s*/, '')) // Remove list markers like "1. ", "- ", etc.
        .filter((s) => s.length > 0 && s.length < 30)
    }

    // Final cleanup: take 3, deduplicate, and limit length
    return [...new Set(suggestions)].slice(0, 3).map((item) => String(item).slice(0, 30))
  } catch (err) {
    console.error(`[AI-Service] Failed to generate search suggestions for "${query}":`, err.message)
    return []
  }
}
