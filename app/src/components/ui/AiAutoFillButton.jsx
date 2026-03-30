import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, Check } from 'lucide-react'

/**
 * AI Auto-Fill button that sends the uploaded image to the backend
 * for analysis and returns structured suggestions to populate form fields.
 *
 * @param {string} imageUrl - The URL of the uploaded image
 * @param {function} onSuggest - Callback receiving { title, description, suggestedPrice, condition, category }
 * @param {boolean} disabled - Whether the button is disabled (no image uploaded)
 */
export default function AiAutoFillButton({ imageUrl, onSuggest, disabled, onLoadingChange }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleAnalyze = async () => {
    if (!imageUrl || isAnalyzing) return

    setIsAnalyzing(true)
    if (onLoadingChange) onLoadingChange(true)
    setError('')
    setSuccess(false)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${baseUrl}/api/ai/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imageUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image')
      }

      onSuggest(data.suggestions)
      setSuccess(true)

      // Clear success state after a few seconds
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      console.error('AI analysis error:', err)
      setError(err.message || 'Could not reach AI service. Try again or fill fields manually.')
    } finally {
      setIsAnalyzing(false)
      if (onLoadingChange) onLoadingChange(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={disabled || isAnalyzing}
        className={`
          group relative inline-flex items-center justify-center gap-2.5 
          px-5 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-300 ease-out
          ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isAnalyzing
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white cursor-wait'
                : success
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        {/* Animated shimmer overlay during loading */}
        {isAnalyzing && (
          <span className="absolute inset-0 rounded-xl overflow-hidden">
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </span>
        )}

        {/* Icon */}
        {isAnalyzing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : success ? (
          <Check className="w-4 h-4" />
        ) : (
          <Sparkles
            className={`w-4 h-4 transition-transform duration-300 ${
              !disabled ? 'group-hover:rotate-12 group-hover:scale-110' : ''
            }`}
          />
        )}

        {/* Label */}
        <span className="relative">
          {isAnalyzing ? 'Analyzing image...' : success ? 'Fields populated!' : '✨ AI Auto-Fill'}
        </span>
      </button>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Auto-fill unavailable</p>
            <p className="text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
          <Check className="w-4 h-4 flex-shrink-0" />
          <p>
            Fields have been auto-filled by AI.{' '}
            <span className="font-medium">Please review before submitting.</span>
          </p>
        </div>
      )}

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
